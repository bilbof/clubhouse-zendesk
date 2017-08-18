import View from 'view';
import Storage from 'storage';
import clubhouse from './clubhouse.js';

class TicketSidebar {
  constructor(client, data) {
    this.client = client;
    this._metadata = data.metadata;
    this._context = data.context;

    this.storage = new Storage(this._metadata.installationId);
    this.view = new View();
    this.view.switchTo('loading');
    this.client.get('ticket')
    .then(result => {
      this.ticket = result.ticket;
      this.renderMain.bind(this)();
    })
  }

  getCurrentUser() {
    return this.client.request({ url: '/api/v2/users/me.json' });
  }

  getClubhouseStory(ticket) {
    var tags = ticket.tags.filter((tag) => tag.includes('clubhouse_story_'))
    var id = tags[0] ? tags[0].split('clubhouse_story_')[1] : 0;
    return clubhouse.stories.fetch(id);
  }

  assignClubhouseIDToTicket(ticket, id){
    return this.client.request({
      url: '/api/v2/tickets/'+ticket.id+'/tags.json',
      method: 'PUT',
      data: { "tags": ['clubhouse_story_'+id] }
    });
  }

  getMostRecentTicketComment() {
    return this.client.request({ url: '/api/v2/tickets/'+this.ticket.id+'/comments.json' })
    .then(result => {
      return result.comments[result.comments.length -1];
    })
  }

  renderMain(e) {
    if (e) { e.preventDefault(); }
    this.client.invoke('resize', { height: '150px', width: '100%' });
    this.getClubhouseStory(this.ticket)
    .then(story => {
      this.renderStory.bind(this)(story)
    })
    .catch(error => {
      if (error.status == 404) {
        this.view.switchTo('main');
        $('#create-new').click(this.renderCreate.bind(this));
        $('#connect-new').click(this.renderConnect.bind(this));
      } else {
        this.client.invoke('notify', 'Error: ' + error.statusText, 'error');
      }
    })
  }

  renderCreate() {
    clubhouse.projects.list()
    .then(projects => {
      this.ticket.projects = projects;
      this.view.switchTo('create', this.ticket);
      this.client.invoke('resize', { height: '550px', width: '100%' });
      $('#create').click(this.createStory.bind(this));
      $('#cancel').click(this.renderMain.bind(this));
      $('#insert-fields').click(this.insertDescription.bind(this));
    })
  }

  linkStory() {
    let id = $('#ch-story-id').val()
    $('#ch-name').parent().removeClass('has-error')

    if (!id) {
      return $('#ch-story-error').parent().addClass('has-error');
    }

    clubhouse.stories.fetch(id)
    .then(result => {
      this.assignClubhouseIDToTicket(this.ticket, result.id);
      this.client.invoke('notify', '<b>' +result.name + '</b> was linked to this ticket', 'notice');
      this.renderStory.bind(this)(result);
    })
    .catch(error =>{
      $('#ch-story-error').addClass('has-error');
      this.client.invoke('notify', 'Error connecting to Story: ' + error.statusText, 'error');
    })
  }

  renderConnect() {
    this.client.invoke('resize', { height: '250px', width: '100%' });
    this.view.switchTo('link');
    $('#link').click(this.linkStory.bind(this));
    $('#cancel').click(this.renderMain.bind(this));
  }

  createStory(e) {
    e.preventDefault()
    $('#ch-name').parent().removeClass('has-error')

    var story = {
      name: $('#ch-name').val(),
      description: $('#ch-description').val(),
      project_id: $('#ch-project').val(),
      external_id: "zendesk-" + this.ticket.id
    }

    if (!story.name) {
      return $('#ch-name').parent().addClass('has-error')
    }

    clubhouse.stories.create(story)
    .then(result => {
      this.assignClubhouseIDToTicket(this.ticket, result.id);
      this.client.invoke('notify', '<b>' +story.name + '</b> was created', 'notice');
      this.renderStory.bind(this)(result);
    })
    .catch(error => {
      this.client.invoke('notify', 'Error creating Story: ' + error.statusText, 'error');
    })
  }

  insertDescription() {
    return this.getMostRecentTicketComment()
    .then(comment =>{
      $('#ch-name').val(this.ticket.subject)
      $('#ch-description').val(comment.body)
    }).catch(error => {
      this.client.invoke('notify', 'Error getting comment: ' + error.statusText, 'error');
    })
  }

  getStoryStatus(story, workflows) {
    return workflows.states.filter((state) => state.id == story.workflow_state_id)[0]
  }

  getStoryProject(story, projects) {
    return projects.filter((project) => project.id == story.project_id)[0]
  }

  renderStory(story) {
    let promises = [
      clubhouse.projects.list(),
      clubhouse.workflows.list()
    ]

    if (story.owner_ids.length) {
      promises.push(clubhouse.users.fetch(story.owner_ids[0]))
    }

    Promise.all(promises)
    .then(results => {
      story.project = this.getStoryProject(story, results[0]);
      story.status = this.getStoryStatus(story, results[1][0]);
      story.owner = results[2];
      this.view.switchTo('story', story);
      this.client.invoke('resize', { height: '325px', width: '100%' });
    })
    .catch(error =>{
      this.client.invoke('notify', 'Error rendering story: ' + error.statusText, 'error');
    })
  }
}

export default TicketSidebar;
