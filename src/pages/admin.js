import React from 'react'
import netlifyIdentity from 'netlify-identity-widget'

export default class Admin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      style: {
        opacity: 0,
        pointerEvents: 'none',
      },
    }
  }
  componentDidMount() {
    netlifyIdentity.on('init', user => {
      if (!user) return
      console.log('init', user)
      this.setState({ user })

      user.jwt().then(() => {
        const headers = {
          Authorization: 'Bearer ' + user.token.access_token,
        }
        const getMaster = window.fetch(
          'https://fullmoviesonyt.com/.netlify/git/github/contents/data/editables.json',
          {
            headers,
          }
        )
        const getDraft = window.fetch(
          'https://fullmoviesonyt.com/.netlify/git/github/contents/data/editables.json?ref=draft',
          {
            headers,
          }
        )
        // window
        //   .fetch('https://fullmoviesonyt.com/.netlify/git/github/pulls', {
        //     headers,
        //   })
        //   .then(res => res.json())
        //   .then(res => {
        //     this.setState({
        //       pr: res.filter(
        //         pull => pull.base.ref === 'master' && pull.head.ref === 'draft'
        //       )[0],
        //     })
        //   })
        Promise.all([getMaster, getDraft])
          .then(([m, d]) => Promise.all([m.json(), d.json()]))
          .then(res => {
            this.setState({
              masterSha: res[0].sha,
              draftSha: res[1].sha,
            })
            const master = JSON.parse(window.atob(res[0].content))
            const draft = JSON.parse(window.atob(res[1].content))
            const data = merge(master, draft)
            console.log(data)
            window.draft = draft
            window.editables = data
            window.ready = () => this.setState({ style: {} })
            window.save = this.save.bind(this)
            this.setState({ ready: true })
          })
      })
    })
    netlifyIdentity.init()
  }
  save(e) {
    window
      .fetch(
        'https://fullmoviesonyt.com/.netlify/git/github/contents/data/editables.json',
        {
          method: 'put',
          headers: {
            Authorization: 'Bearer ' + this.state.user.token.access_token,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            branch: 'draft',
            sha: this.state.draftSha,
            content: window.btoa(
              JSON.stringify(
                merge(window.draft, [
                  { page: e.page, name: e.name, value: e.value },
                ]),
                null,
                2
              )
            ),
            message: 'test edit',
          }),
        }
      )
      .then(res => res.json())
      .then(res => this.setState({ draftSha: res.content.sha }))
  }
  publish() {
    this.createPullRequest
      .bind(this)()
      .then(pr =>
        window.fetch(
          `https://fullmoviesonyt.com/.netlify/git/github/pulls/${
            pr.number
          }/merge`,
          {
            method: 'put',
            headers: {
              Authorization: 'Bearer ' + this.state.user.token.access_token,
            },
          }
        )
      )
      .then(res => res.json())
      .then(res => console.log(res))
      .then(this.cleanDraft.bind(this))
      .then(res => console.log(res))
  }
  createPullRequest() {
    return window
      .fetch('https://fullmoviesonyt.com/.netlify/git/github/pulls', {
        method: 'post',
        headers: {
          Authorization: 'Bearer ' + this.state.user.token.access_token,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          title: 'CMS',
          base: 'master',
          head: 'draft',
        }),
      })
      .then(res => res.json())
  }
  cleanDraft() {
    return window
      .fetch(
        'https://fullmoviesonyt.com/.netlify/git/github/contents/data/editables.json',
        {
          method: 'put',
          headers: {
            Authorization: 'Bearer ' + this.state.user.token.access_token,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            branch: 'draft',
            sha: this.state.draftSha,
            content: window.btoa('[]'),
            message: 'post-publish',
          }),
        }
      )
      .then(res => res.json())
      .then(res => {
        this.setState({ draftSha: res.content.sha })
        return res
      })
  }
  render() {
    return (
      <div>
        <button onClick={() => netlifyIdentity.open()}>login</button>
        <button onClick={() => this.publish()}>Publish</button>
        {typeof window !== 'undefined' &&
          this.state.ready && (
            <iframe src={window.location.origin} style={this.state.style} />
          )}
      </div>
    )
  }
}

function merge(master, draft) {
  const result = master.slice(0)
  draft.forEach(a => {
    let index = -1
    master.some((b, i) => {
      if (b.page === a.page && b.name === a.name) {
        index = i
        return true
      }
      return false
    })
    if (index !== -1) {
      result[index].value = a.value
    } else {
      result.push(a)
    }
  })
  return result
}
