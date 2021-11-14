/*Get buttons*/
var RunCodeBtn = document.getElementById('RunCodeBtn');
var ExprtBtn = document.getElementById('ExprtBtn');
var ExprtBtn1 = document.getElementById('ExprtBtn1');
var CloseErrorBtn = document.getElementById('CloseErrorBtn');
var OpenBtn = document.getElementById('OpenBtn');

/*Theme selector*/
var ThemeSelect = document.getElementById('ThemeSelect');

/*Get notification boxes*/
var NotifBox = document.getElementById('Notif');
var NotifBoxTitle = document.getElementById('NotifTitle');
var NotifBoxMessage = document.getElementById('NotifMessage');
var NotifCheckbox = document.getElementById('NotifCheckbox');
var NotifCheckbox1 = document.getElementById('NotifCheckbox1');
var NotifCheckbox2 = document.getElementById('NotifCheckbox2');

/*File input*/
var fileOpenInput = document.getElementById('file-open-input');

/*DEBUG*/
function logval() {
  console.log(rawusercode);
  console.log(libpath);
}

var editorWrapper = document.getElementsByClassName('editor')[0];
editorWrapper.className = 'editor full-width';
var onCmUpdate = null;
var cm;

window.addEventListener('DOMContentLoaded', function(e) {
  console.log("DOM Ready");
  cm = CodeMirror.fromTextArea(editor, {
      lineNumbers: true,
      styleActiveLine: true,
      mode: 'text/html',
      theme: 'monokai',
      scrollbarStyle: 'overlay',
      extraKeys: {
        "F11": function(cm) {
          cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        },
        "Esc": function(cm) {
          if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
        }
      }
  });

  /* Buttons */
  RunCodeBtn.addEventListener("click", () => {
    var rawusercode = cm.getValue();
    var libpath = path.join(__dirname, "/assets/lib");
    if (rawusercode == '') {
      Notif.classList.add("danger");
      play('assets/internal/sound/error.mp3');
      console.log("Input empty.");
      NotifTitle.innerHTML = 'Error:';
      NotifMessage.innerHTML = 'No code to execute, please fill in the editor.';
      Notif.style.display='block';
    } else {
      //logval();
      try {
        var popupWinWidth = "400";
        var popupWinHeight = "400";
        var left = (screen.width / 2) - (popupWinWidth / 2);
  	    var top = (screen.height / 2) - (popupWinHeight / 2);
        var win = window.open("", "Your Code", `resizable=yes, width=${popupWinWidth}, height=${popupWinHeight}, top=${top}, left=${left}`);
        var usercode = replaceAll(rawusercode, "{!GriphLib}", libpath)
        //var usercode = rawusercode.replace('{!GriphLib}'g, libpath);
        //console.log(usercode);
        win.document.body.innerHTML = usercode
        play('assets/internal/sound/success.mp3');
      } catch (e) {
        Notif.classList.add("danger");
        console.log(e);
        play('assets/internal/sound/error.mp3');
        NotifTitle.innerHTML = 'Error:';
        NotifMessage.innerHTML = `An error has accured, here is the error: ${e}`;
        NotifCheckbox.style.display='none';
        Notif.style.display='block';
      }
    }
  });

  CloseErrorBtn.addEventListener("click", () => {
    Notif.style.display='none';
    Notif.classList.remove("danger");
    Notif.classList.remove("info");
    Notif.classList.aremove("warning");
    Notif.classList.remove("success");
  });

  ExprtBtn.addEventListener("click", () => {
    if (cm.getValue() == '') {
      Notif.classList.add("danger");
      play('assets/internal/sound/error.mp3');
      console.log("All inputs are empty.");
      NotifTitle.innerHTML = 'Error:';
      NotifMessage.innerHTML = 'No code to export, please fill in the editor.';
      NotifCheckbox.style.display='none';
      Notif.style.display='block';
    } else {
      Notif.classList.add("info");
      NotifBoxTitle.innerHTML = 'What do you want to export this as?';
      NotifMessage.innerHTML = '';
      NotifCheckbox.style.display='block';
      NotifBox.style.display='block';
      ExprtBtn1.addEventListener("click", () => {
        if (NotifCheckbox1.checked == true) {
          console.log("Exporting as file");
          NotifTitle.innerHTML = 'Exporting';
          NotifMessage.innerHTML = 'Exporting file...';
          NotifCheckbox.style.display='none';
          try {
            var rawusercode = cm.getValue();
            var usercode = rawusercode.replace(`{!GriphLib}/css/fa-4.7.0-min.css`, `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css`);
            usercode = usercode.replace(`{!GriphLib}/css/fa-5.7.0-min.css`, `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.7.0/css/font-awesome.min.css`);
            usercode = usercode.replace(`{!GriphLib}/css/tailwindcss-2.2.16-min.css`, `https://unpkg.com/tailwindcss@2.2.16/dist/tailwind.min.css`);
            GenFile(usercode, "html");
            Notif.classList.add("success");
            play('assets/internal/sound/success.mp3');
            NotifTitle.innerHTML = 'Export Complete!';
            NotifMessage.innerHTML = 'Exporting Completed!';
            NotifCheckbox.style.display='none';
            Notif.style.display='block';
          } catch (e) {
            console.log(e);
            Notif.classList.add("danger");
            play('assets/internal/sound/error.mp3');
            NotifTitle.innerHTML = 'Error:';
            NotifMessage.innerHTML = `An error has accured, here is the error: \n${e}`;
            NotifCheckbox.style.display='none';
            Notif.style.display='block';
          };
        } else if (NotifCheckbox2.checked == true) {
          Notif.classList.add("info");
          console.log("Exporting as zip");
          NotifTitle.innerHTML = 'Exporting';
          NotifMessage.innerHTML = 'Exporting files...';
          NotifCheckbox.style.display='none';
          try {
            MakeZip(cm.getValue());
            Notif.classList.add("success");
            play('assets/internal/sound/success.mp3');
            NotifTitle.innerHTML = 'Export Complete!';
            NotifMessage.innerHTML = 'Exporting Completed!';
            NotifCheckbox.style.display='none';
            Notif.style.display='block';
          } catch (e) {
            console.log(e);
            Notif.classList.add("danger");
            play('assets/internal/sound/error.mp3');
            NotifTitle.innerHTML = 'Error:';
            NotifMessage.innerHTML = `An error has accured, here is the error: \n${e}`;
            NotifCheckbox.style.display='none';
            Notif.style.display='block';
          };
        };
      });
    };
  });

  OpenBtn.addEventListener("click", () => {
    if (fileOpenInput) {
      fileOpenInput.click();
    }
    fileOpenInput.onchange = function(e)
    {
      var file = fileOpenInput.files[0];
      var reader = new FileReader();
      console.log(file.type);
      reader.onload = function(e) {
          cm.setValue(reader.result);
      }
      reader.readAsText(file);
    }
  });
  /*Get editor theme pref*/
  var EditorTheme = getData('EditorTheme');
  if (EditorTheme) {
    ThemeSelect.value = EditorTheme;
    cm.setOption("theme", EditorTheme);
  } else {
    ThemeSelect.value = 'monokai';
    cm.setOption("theme", 'monokai');
  }
  ThemeSelect.onchange = function() {
    var theme = ThemeSelect.options[ThemeSelect.selectedIndex].textContent;
    console.log(theme);
    cm.setOption("theme", theme);
    if (getData('EditorTheme')) {
      updateData('EditorTheme', theme)
    } else {
      storeData('EditorTheme', theme)
    }
  };
});
