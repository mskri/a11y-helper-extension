document.addEventListener('DOMContentLoaded', function() {
  var toggleBlurButton = document.getElementById('toggle-blur');
  var toggleOutlineButton = document.getElementById('toggle-outline');
  var cssInserted = false;

  if (!cssInserted) {
    cssInserted = true;
    chrome.tabs.insertCSS(null, { file: 'a11y-helper.css' });
  }

  var toggleBlur = enabled => {
    chrome.storage.local.set({ blurEnabled: enabled });

    var codeToRun;

    if (enabled) {
      codeToRun = 'document.body.classList.add("a11y-helper-blur");';
    } else {
      codeToRun =
        'document.querySelector("body").classList.remove("a11y-helper-blur");';
    }

    chrome.tabs.executeScript(null, { code: codeToRun });
  };

  var toggleOutline = enabled => {
    chrome.storage.local.set({ outlineEnabled: enabled });

    var codeToRun;

    if (enabled) {
      codeToRun = 'document.body.classList.add("a11y-helper-outline");';
    } else {
      codeToRun =
        'document.querySelector("body").classList.remove("a11y-helper-outline");';
    }

    chrome.tabs.executeScript(null, { code: codeToRun });
  };

  chrome.tabs.onUpdated.addListener((_, info) => {
    chrome.storage.local.clear();

    if (info.status === 'completed') {
      chrome.storage.local.get(['blurEnabled'], data => {
        var enabled = !!data.blurEnabled;
        toggleBlurButton.checked = enabled;
      });

      chrome.storage.local.get(['outlineEnabled'], data => {
        var enabled = !!data.outlineEnabled;
        toggleOutlineButton.checked = enabled;
      });
    }
  });

  // chrome.tabs.onRemoved.addListener(() => {
  //   // chrome.storage.remove(['blurEnabled', 'outlineEnabled']);
  //   // chrome.storage.local.clear();
  // });

  toggleBlurButton.addEventListener('change', event => {
    var isChecked = event.target.checked;
    toggleBlur(isChecked);
  });

  toggleOutlineButton.addEventListener('change', event => {
    var isChecked = event.target.checked;
    toggleOutline(isChecked);
  });
});
