import Origo from 'Origo';


const IwMinimizer = function IwMinimizer(options = {}) {
  let minimizeButton;
  let previousSelection;
  let forceShow = false;
  const showMinimizeButton = Object.prototype.hasOwnProperty.call(options, 'showMinimizeButton') ? options.showMinimizeButton : false;


  function isHidden(element) {
    return element.classList.contains('o-hidden');
  }

  function getNumberOfActiveSelectionGroups() {
    let counter = 0;
    document.getElementsByClassName('urvalelement').forEach((element) => {
      if (!element.classList.contains('hidden')) {
        counter += 1;
      }
    });
    return counter;
  }

  function showElements(elements) {
    elements.forEach((element) => {
      if (isHidden(element)) {
        element.classList.remove('o-hidden');
      }
    });
  }

  function hideElements(elements) {
    elements.forEach((element) => {
      if (!isHidden(element)) {
        element.classList.add('o-hidden');
      }
    });
  }

  function handleElementChanges(element) {
    const listContainer = document.getElementsByClassName('listcontainer')[0];
    const sidebarContainer = document.getElementById('sidebarcontainer-draggable');
    const exportContainer = document.getElementsByClassName('exportcontainer')[0];
    const currentSelection = element.textContent.replace(/\s*\(.*?\)\s*/g, '');

    if (isHidden(listContainer) || forceShow || (typeof previousSelection === 'undefined' && forceShow == null) || (getNumberOfActiveSelectionGroups() > 1 && currentSelection !== previousSelection)) {
      showElements([listContainer, exportContainer]);
      sidebarContainer.style = '';
      forceShow = false;
    } else {
      hideElements([listContainer, exportContainer]);
      sidebarContainer.style = 'border-bottom: 0px;';
    }

    previousSelection = currentSelection;
  }

  return Origo.ui.Component({
    name: 'IwMinimizer',
    onInit() {
      minimizeButton = Origo.ui.Element({
        tagName: 'div',
        style: {
          color: '#4d4d4d',
          cursor: 'pointer',
          position: 'absolute',
          right: '3em',
          top: '1em',
          width: '0.5rem',
          height: '0.5rem',
          'border-bottom': '2px solid #4d4d4d'
        }
      });
    },
    onAdd() {
      const listContainer = document.getElementsByClassName('listcontainer')[0];
      const sidebarContainer = document.getElementById('sidebarcontainer-draggable');
      const exportContainer = document.getElementsByClassName('exportcontainer')[0];
      if (showMinimizeButton) {
        document.querySelector('.urval-textnode-container').after(Origo.ui.dom.html(minimizeButton.render()));
        document.getElementById(minimizeButton.getId()).addEventListener('click', () => {
          hideElements([listContainer, exportContainer]);
          sidebarContainer.style = 'border-bottom: 0px;';
        });
      }

      const observer = new MutationObserver(() => {
        const selection = document.getElementsByClassName('selectedurvalelement').item(0);
        forceShow = selection && selection.classList.contains('hidden');

        if (forceShow || isHidden(listContainer)) {
          hideElements([exportContainer]);
          sidebarContainer.style = 'border-bottom: 0px;';
        } else {
          showElements([exportContainer]);
          sidebarContainer.style = '';
        }

        if (listContainer) {
          document.getElementsByClassName('urvalelement').forEach((element) => {
            if (!element.getAttribute('hasMinimizeListener')) {
              element.setAttribute('hasMinimizeListener', true);
              element.addEventListener('click', () => handleElementChanges(element));
            }
          });
        }
      });

      observer.observe(document.querySelector('#sidebarcontainer'), { attributes: true, childList: true, characterData: true });
    }
  });
};

export default IwMinimizer;
