document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');

  // Message
  const message = document.querySelector('#message');
});


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector(`#email-view`).style.display = 'none';
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
      
      // Email sent successfully
      if (!result.error) {
        message.innerHTML = `<div class="alert alert-success" role="alert">
        ${result.message}
        </div>`
        // Redirect to sent mailbox
        load_mailbox('sent');
      } else {
        message.innerHTML = `<div class="alert alert-danger" role="alert">
        ${result.error}
      </div>`
      };
    });
    return false;
  }
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector(`#email-view`).style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Load Mailbox
  // GET request to /emails/<mailbox>
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    //Print emails
    console.log('Printing emails...');
    console.log(emails);
    console.log('End...');

    // display each email in div
    for (i = 0; i < emails.length; i++) {
      const email_id = emails[i].id;
      
      const entry_row = document.createElement('div');
      entry_row.className = 'row entry_row';
      
      const email_list = document.createElement('div');
      email_list.className = 'email_list col-sm-12 border';

       // email_list div 
       email_list.innerHTML = `
       <div class="row">
         <div class="col-md-3">
           <div class="card-body"><strong>${emails[i].sender}</strong></div>
         </div>
         <div class="col-md-6">
           <div class="card-body">${emails[i].subject}</div>
         </div>
         <div class="col-md-3 text-right">
           <div class="card-body"><small>${emails[i].timestamp}<small></div>
         </div>
       </div>
     `;
      
      const icon_list = document.createElement('div');
      icon_list.className = 'icon_list col-sm-1';
      icon_list.style.display ='none';
      
      const icon_row = document.createElement('div');
      icon_row.className= 'row icon_row';
      
      const archive_list = document.createElement('div');
      archive_list.className = 'archive_list col-sm-6';

      // archive_list div 
      // if not archived
      if (emails[i].archived === false) {
        archive_list.innerHTML = `
          <div class="row">
            <div class="card-body px-1">
              <i onclick="archive_mail(${email_id}, ${emails[i].archived})" class="material-icons-outlined" style="font-size: 30px; color: gray">archive</i>
            </div>
          </div>
          
        `;
      // if archived
      } else {
        archive_list.innerHTML = `
          <div class="row">
            <div class="card-body px-1">
              <i onclick="archive_mail(${email_id}, ${emails[i].archived})" class="material-icons-outlined" style="font-size: 30px; color: gray">unarchive</i>
            </div>
          </div>
        `;
      };
      
      const read_list = document.createElement('div');
      read_list.className = 'read_list col-sm-6';

      // read_list div 
      // if not read
      if (emails[i].read === false) {
        read_list.innerHTML = `
          <div class="row">
            <div class="card-body px-1">
              <i onclick="read_mail(${email_id}, ${emails[i].read})" class="material-icons-outlined" style="font-size: 30px; color: gray">mark_email_read</i>
            </div>
          </div>
          
        `;
      // if read
      } else {
        read_list.innerHTML = `
          <div class="row">
            <div class="card-body px-1">
              <i onclick="read_mail(${email_id}, ${emails[i].read})" class="material-icons-outlined" style="font-size: 30px; color: gray">mark_email_unread</i>
            </div>
          </div>
        `;
      };

      // When mouseover email card
      email_list.addEventListener('mouseover', () => {
        email_list.className = 'email_list col-sm-11 border border-primary';
        icon_list.style.display = 'block';
      });

      // When mouseout email card
      email_list.addEventListener('mouseout', () => {
        email_list.className = 'email_list col-sm-12 border';
        icon_list.style.display = 'none';
      });

      // When mouseover icon_list
      icon_list.addEventListener('mouseover', () => {
        email_list.className = 'email_list col-sm-11 border border-primary';
        icon_list.style.display = 'block';
      });

      // When mouseout icon_list
      icon_list.addEventListener('mouseout', () => {
        email_list.className = 'email_list col-sm-12 border';
        icon_list.style.display = 'none';
      });

      document.querySelectorAll('.material-icons-outlined').forEach(function(icon) {
        icon.onmouseover = () => {
          icon.style.color = "#0275d8";
        }
        icon.onmouseout = () => {
          icon.style.color = "gray";
        }
      });


      // When email card is clicked
      email_list.addEventListener('click', () => {
        view_mail(email_id, mailbox)
        return false;
      });
    
      // check if email is read
      const card = document.querySelector('card')
      if (emails[i].read === true) {
        email_list.style.backgroundColor = "#EAEAEA";
        
      } else {
        email_list.style.backgroundColor = "white";
      }

      icon_row.append(archive_list);
      icon_row.append(read_list);
      icon_list.append(icon_row);
      entry_row.append(email_list);
      entry_row.append(icon_list);
      document.querySelector('#emails-view').append(entry_row);
    }

  });
}

function view_mail(id, mailbox) {

  // Show the email view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Fetch email with id
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    // Print email
    console.log('Print email...');
    console.log(email);
    console.log('End...');

    // Print layout
    document.querySelector('#email-from').innerHTML = email.sender;
    document.querySelector('#email-to').innerHTML = email.recipients;
    document.querySelector('#email-subject').innerHTML = email.subject;
    document.querySelector('#email-timestamp').innerHTML = email.timestamp;
    document.querySelector('#email-body').innerHTML = email.body;

    // START TESTING

    const outer_buttons = document.querySelector('#outer_buttons')
    outer_buttons.innerHTML = '';
    
    const inner_buttons = document.createElement('div');
    inner_buttons.className = 'inner_buttons';

    const reply_button = document.createElement('button');
    reply_button.type = 'button';
    reply_button.className = 'reply_button btn btn-light';
    reply_button.innerHTML = 'Reply';
    reply_button.addEventListener('click', () => {
      reply_email(id);
    });

    inner_buttons.append(reply_button);

    if (mailbox !== 'sent') {

      const archive_button = document.createElement('button');
      archive_button.type = 'button';
      archive_button.addEventListener('click', () => {
        archive_mail(id, email.archived);
      });

      if (email.archived === false) {
        archive_button.className = 'archive_button btn btn-light';
        archive_button.innerHTML = 'Archive';
      } else {
        archive_button.className = 'archive_button btn btn-dark';
        archive_button.innerHTML = 'Unarchive';
      };
      
      inner_buttons.append(archive_button);
      
    };

    outer_buttons.append(inner_buttons);


    // END TESTING

    // Change email to read
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        read: true
      })
    });

    return false;

  });
}

function reply_email(email_id) {
  
  console.log('reply clicked...');
  console.log(email_id);
  // Fetch email with id
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
    // Print email
    console.log('Print email...');
    console.log(email);
    console.log('End...');

    sender_address = email.sender;
    email_subject = email.subject;
    email_body = email.body;
    email_timestamp = email.timestamp;

    // Run compose mail function
    compose_email();
    
    // Edit subject line
    if (email_subject.substring(0,4) !== 'Re: ') {
      email_subject = 'Re: ' + email_subject;
    };

    // Edit email body
    new_body = `\n\n----------------------------------------\nOn ${email_timestamp}, ${sender_address} wrote:\n\n${email_body}`
    // Edit recipients input field
    document.querySelector("#compose-recipients").value = sender_address;
    document.querySelector('#compose-subject').value = email_subject;
    document.querySelector('#compose-body').value = new_body;
  });
}

function archive_mail(email_id, archived_status) {
  
  console.log(`email with id ${email_id} current archived status: ${archived_status}`);
  
  if (archived_status === false) {
    // Archive email
    fetch(`/emails/${email_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: true
      })
    })
    console.log('Archived!');
  } else {
    // Unarchive email
    fetch(`/emails/${email_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: false
      })
    })
    console.log('Unarchived!');
  };
  setTimeout(() => load_mailbox('inbox'), 100);
  return false;
}

function read_mail(email_id, read_status) {
  
  console.log(`email with id ${email_id} current read status: ${read_status}`);
  
  if (read_status === false) {
    // Read email
    fetch(`/emails/${email_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        read: true
      })
    })
    console.log('Read!');
  } else {
    // Unread email
    fetch(`/emails/${email_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        read: false
      })
    })
    console.log('Read!');
  };
  setTimeout(() => load_mailbox('inbox'), 100);
  return false;
}