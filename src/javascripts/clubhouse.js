// contains clubhouse
const API_BASE    = 'https://api.clubhouse.io/api/v1';
const TOKEN_PARAM = '?token={{setting.token}}';
const PROJECTS    = '/projects';
const STORIES     = '/stories';
const WORKFLOWS   = '/workflows';
const USERS       = '/users';

var clubhouse = {
  init: (client) => {
    clubhouse.client = client;
    return clubhouse;
  },
  request: (urlParams, settings = {}) => {
    settings.url = API_BASE + urlParams + TOKEN_PARAM;
    settings.secure = true;
    return clubhouse.client.request(settings);
  },
  projects: {
    list: () => clubhouse.request(PROJECTS)
  },
  stories: {
    create: (story) => clubhouse.request(STORIES, {method: 'POST', data: story}),
    fetch: (id) => clubhouse.request(STORIES + '/' + id),
    search: (text) => clubhouse.request(STORIES + '/search', {data: { 'text': text } }),
    list: (projectID) => clubhouse.request(PROJECTS + '/' + projectID + '/stories')
  },
  comments: {
    create: (storyID, comment) => clubhouse.request(STORIES + storyID + '/comments', {method: 'POST', data: comment})
  },
  workflows: {
    list: () => clubhouse.request(WORKFLOWS)
  },
  users: {
    fetch: (id) => clubhouse.request(USERS + '/' + id)
  }
}

export default clubhouse
