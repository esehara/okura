const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

ipcRenderer.send('get-from-list', '');

function tweet() {
    ipcRenderer.send('tweet', 'オッではない');
}

function ottu(tweet_data) {
    ipcRenderer.send('ottu', tweet_data);
}

function refresh() {
    var element = document.getElementById('ottu_post');
    element.innerHTML = '';
    ipcRenderer.send('get-from-list', '');
}

ipcRenderer.on('render-from-list', (event, args) => {
    args.forEach( (elem) =>
                  {

                      var appendElement = document.createElement('li');
                      var titleElement = document.createElement('h2');
                      var textElement = document.createElement('p');
                      var buttonElement = document.createElement('button')
                      buttonElement.onclick = () => {
                          ottu({name: elem.user.screen_name , tweet_id: elem.id_str});
                      };
                      buttonElement.innerHTML = 'オッ';
                      titleElement.innerHTML = elem.user.name;
                      textElement.innerHTML = elem.text;

                      appendElement.appendChild(titleElement);
                      appendElement.appendChild(textElement);
                      appendElement.appendChild(buttonElement);

                      document.getElementById('ottu_post').appendChild(appendElement);
                  });
});
