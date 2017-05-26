var editResetables = (function (selector) {
  this.selector = selector;

  var menu = {
    state: 0,
    getNode: function() { return document.querySelector('#context-menu'); },
    activeClass: 'context-menu--active',
    toggle: {
      on: function toggleMenuOn() {
        if (!menu.state) {
          alert('on');
          menu.state = true;
          menu.setPosition();
          menu.node.classList.add(menu.activeClass);
        }
      },
      off: function toggleMenuOff() {
        if (menu.state) {
          alert('off');
          menu.state = false;
          menu.node.classList.remove(menu.activeClass);
        }
      }
    },
    appendToDocument: function () {
      //var container = document.createElement('div');
      //container.innerHTML = menu.html;
      //document.querySelector('body').appendChild(container);
      menu.node = document.querySelector('#context-menu');
    },
    getPosition: function (ev) {
      var posx = 0;
      var posy = 0;
      if (!ev) var ev = window.event;

      if (ev.pageX || ev.pageY) {
        posx = ev.pageX;
        posy = ev.pageY;
      } else if (ev.clientX || ev.clientY) {
        posx = ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = ev.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      return {
        x: posx,
        y: posy
      }
    },
    position: null,
    setPosition: function (ev) {
      menu.position = menu.getPosition(ev);
      menu.positionX = menu.position.x + "px";
      menu.positionY = menu.position.y + "px";
      menu.node.style.left = menu.positionX;
      menu.node.style.top = menu.positionY;
    }
  };

  this.setListenerTo = (item) => {
    item.style.cursor = 'context-menu';
    item.addEventListener('contextmenu', function(ev) {
      ev.stopPropagation();
      ev.preventDefault();
      if (!ev.target.hasAttribute('resetable')) return;

      var editable = ev.target;
      var fieldset = item.closest('fieldset');

      switch (ev.target.tagName.toLowerCase()) {
        case 'span':
        case 'p':
        case 'label':
        case 'h3':
          var currentValue = editable.innerHTML;
          var newValue = prompt('Label', currentValue);
          if (newValue && newValue != currentValue) {
            editable.innerHTML = newValue;
            defParser().saveFieldsetDef(fieldset, { label: newValue });
          }
          break;
        case 'textarea':
        case 'input':
          var currentValue = editable.getAttribute('placeholder');
          var newValue = prompt('Placeholder', currentValue);
          if (newValue && newValue != currentValue) {
            editable.setAttribute('placeholder', newValue);
            defParser().saveFieldsetDef(fieldset, { placeholder: newValue });
          }
          break;
        default:
          ev.target.removeAttribute('resetable');
          break;
      }

      if (fieldset.getAttribute('name')) {
        var required = Boolean(confirm('Requerido?'));
        defParser().saveFieldsetDef(fieldset, { required: required });
        if (required)
          fieldset.setAttribute('required', required);
        else
          fieldset.removeAttribute('required');
      }
    })
  }

  this.init = (selector) => {
    document.addEventListener('contextmenu', function(ev) {
      ev.stopPropagation();
      ev.preventDefault();
      return false;
    });
    
    this.selector = selector;
    if (!this.selector) return;

    for(var item of document.querySelectorAll(selector))
      this.setListenerTo(item);

  };

  return this;
})()
