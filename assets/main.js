$(async function() {
  const client = ZAFClient.init();
  // Get App context
  const context = await client.context();
  console.log('Client context : ', { context });
  const currentUser = await client.get('currentUser');
  console.log('Current user : ', { currentUser });
  showCurrentUserInfo(currentUser.currentUser);

  // getAgentInfo(client)
  // // Ticket info
  // const ticket = await client.get('ticket');
  // console.log('Ticket : ', ticket.ticket);

  // // App instance
  // const instances = await client.get('instances');
  // console.log('App instances : ', instances.instances);

  // const data = await client.get('ticket.requester.id');
  // console.log('Data :', data);
  // await requestUserInfo(client, data['ticket.requester.id']);

  // // Change type of comment (facebookPrivateMessage, facebookWallReply, internalNote, publicReply (default), twitterDirectMessage, twitterReply)
  // await client.set('comment.type', 'publicReply');

  // // Write note or reply message
  // // Comment can append Text, HTML, Markdown but have to set comment.useRichText: true
  // const text = await client.invoke('comment.appendText', 'New text of Louis');
  // console.log('Reply message:', text);

  // // Get ticket messages
  // const comments = await client.get('ticket.comments');
  // console.log('Ticket messages : ', comments['ticket.comments']);

  // await client.invoke('resize', { width: '300px', height: '750px' })
});

function getAgentInfo(client) {
  const options = {
    url: '/api/v2/agents/361671832835',
    type:'GET',
    headers: {
      Authorization: 'Bearer RYbWNRN4ce9wb4fQdiVmEH7cDtP9BPITjLeA7yAG',
    },
    dataType: 'json',
  };

  return client.request(options).then(
    (data) => {
      console.log('Data : ', data);
    },
    (response) => showError(response)
  );
}

function showCurrentUserInfo(currentUser) {
  const data = {
    avatar: currentUser.avatarUrl,
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    orgName: currentUser.organizations[0].name,
    role: currentUser.role, 
  };

  document.getElementById('avatar').setAttribute('src', data.avatar);
  document.getElementById('user_name').textContent = data.name;
  document.getElementById('email').textContent = data.email;
  document.getElementById('orgName').textContent = data.orgName;
  document.getElementById('role').textContent = data.role;
}


function showInfo(data) {
  const requester_data = {
    'name': data.user.name,
    'tags': data.user.tags,
    'created_at': formatDate(data.user.created_at),
    'last_login_at': formatDate(data.user.last_login_at),
  };

  const source = $("#requester-template").html();
  const template = Handlebars.compile(source);
  const html = template(requester_data);
  $("#content").html(html);
}

function showError(response) {
  const error_data = {
    'status': response.status,
    'statusText': response.statusText,
  };

  const source = $("#error-template").html();
  const template = Handlebars.compile(source);
  const html = template(error_data);
  $("#content").html(html);
}

function requestUserInfo(client, id) {
  const settings = {
    url: '/api/v2/users/' + id + '.json',
    type:'GET',
    dataType: 'json',
  };

  return client.request(settings).then(
    (data) => showInfo(data),
    (response) => showError(response)
  );
}

function formatDate(date) {
  const cdate = new Date(date);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric"
  };

  date = cdate.toLocaleDateString("en-us", options);
  return date;
}
