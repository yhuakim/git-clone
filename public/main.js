const containerBox = document.querySelector(".main")
const navAvatar = document.querySelector('#avatar-sm')
const profileName = document.querySelector('.name')
const profileUsername = document.querySelector('.username')
const profileEmoji = document.querySelector('#emoji')
const profilePortrait = document.querySelector('#portrait')
const repoContainer = document.querySelector('.repo-wrapper')
const inputWrap = document.querySelector('.input-wrapper')
const navWrap = document.querySelector('.nav')
const menuBtn = document.querySelector('.menu-toggler')

const token = '32db71b8248d7614f689abbb1a264758fddc5e5e'
document.addEventListener('DOMContentLoaded', ()=> {

  menuBtn.addEventListener('click', ()=> {
    navWrap.classList.toggle("hide")
    inputWrap.classList.toggle("hide")
    console.log('clicked')
  })

  const githubURL = 'https://api.github.com/graphql'
  const Oauth = {
    Authorization: `bearer ${token}`,
    //'access-control-allow-origin': "*"
  }
  const query = '{' +
  'user(login: "yhuakim") {'+
    'avatarUrl(size: 15)'+
  '},'+
  'repositoryOwner(login: "yhuakim") { ' +
    '... on User {' +
      'avatarUrl(size: 300),'+
      'login,'+
      'name,'+
      'status {'+
        'emojiHTML'+
      '},'+
      'repositories(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}) {' +
        'edges {' +
          'node {' +
            'name,' +
            'description,' +
            'url,' +
            'updatedAt,'+
            'isFork,' +
            'forkCount,'+
            'stargazerCount,'+
            'licenseInfo {'+
              'name'+
            '},'+
            'languages(first: 1, orderBy: {field: SIZE, direction: DESC}){'+
              'nodes {'+
                'color,'+
                'name'+
              '}'+
            '}'+
            '}' +
          '}' +
        '}' +
      '}' +
    '}' +
  '}' 
                    
  axios.post(githubURL, {query: query}, {headers: Oauth}).then((result) => {
    let resultDetails = result.data.data.repositoryOwner
    let Avatar = result.data.data.user.avatarUrl
    let repos = result.data.data.repositoryOwner.repositories
    const { edges } = repos
    const {avatarUrl, login, name, status} = resultDetails

    profileName.innerHTML += name
    profileUsername.innerHTML += login
    profilePortrait.setAttribute('src', avatarUrl)
    profileEmoji.innerHTML += [status.emojiHTML + '<span class="emoji-text">working from home</span>']
    navAvatar.setAttribute('src', Avatar)


    edges.map((item, index) => {
      let repo = item.node
      const {name, description, url, stargazerCount, updatedAt, forkCount, languages, licenseInfo} = repo
      const languageDetails = languages.nodes[0]
      const license = licenseInfo
      console.log(license !==null? license.name: '')

      const reposHTML = `
      <div class="repos">
      <div class="repo-name">
      <h1><a href=${url} class="repo-link">${name}</a></h1>
      <span class="btn-star"><i ${stargazerCount !==0? 'class="fas fa-star"': 'class="far fa-star"'}></i>Star</span>
  </div>
  <p class="description">${description===null? '' : description}</p>
  <div class="details">
      <span class="language">
          <span ${!languageDetails?'' : "class= 'fas fa-circle'"} style= "color:${!languageDetails? 'transparent': languageDetails.color }" ></span>
          ${!languageDetails?'' : languageDetails.name }
      </span>
      <span class="star">
          <i ${!stargazerCount? '': "class='far fa-star'" }></i>
          ${!stargazerCount? '': stargazerCount}
      </span>
      <span class="forks">
          <i ${forkCount? 'class="fas fa-code-branch"': '' }></i>
           ${forkCount? forkCount: '' }
      </span>
      <span class="license-info" >
      <i ${license !== null? 'class="fas fa-balance-scale"': ''}></i>
      ${license !== null? license.name: ''}</span>
      <span class="update">updated on ${updatedAt}</span>
  </div>
      </div>
      `

     return repoContainer.innerHTML += reposHTML
      //console.log(name, description, index)
      //console.log(item.node)
    })

    //console.log(edges)
    console.log(result.data.data)
  }).catch((err) => {
    console.error(err);
  });
})