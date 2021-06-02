document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Send Mail
  // Listen for submission of compose email form
  document.querySelector('#compose-form').onsubmit = () => {
        
    // Obtain values from input fields
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    // Log values into console
    console.log(`Recipients: ${recipients}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    
    // POST to /emails
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
      })
    })
    .then(response => response.json())
    .then(result => {
      // Print result
      console.log('printing: result...');
      console.log(result);
      console.log(result.error);
      if (!result.error) {
        // Redirect to sent mailbox
        load_mailbox('sent');
      };
    });
    return false;
  }
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Load Mailbox
  // GET request to /emails/<mailbox>
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    //Print emails
    console.log(emails);
    // TODO
    for (i = 0; i < emails.length; i++) {
      const email = document.createElement('div');
      email.className = 'email';
      email.innerHTML = `
      sender ${emails[i].sender}, subject ${emails[i].subject}, timestamp ${emails[i].timestamp}
      `;

      document.querySelector('#emails-view').append(email);
    }

  });
}