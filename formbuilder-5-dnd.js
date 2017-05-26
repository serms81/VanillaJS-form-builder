var DnD = (function() {
  var dragSrcEl = null,
      THIS = this;

  this.drag = {
    start: function handleDragStart(ev) {
      // this / e.target is the source node.
      this.classList.add('dragged');

      dragSrcEl = this;

      ev.dataTransfer.effectAllowed = 'move';

      switch(THIS.mode) {
        case 'moveBefore':
        case 'moveContent':
          ev.dataTransfer.setData("text", ev.target.id);
          break;
        case 'toggleHTML':
          ev.dataTransfer.setData('text/html', this.innerHTML);
          break;
        default:
          alert('DnD mode not defined');
      }
    },
    end: function handleDragEnd(ev) {
      // this / e.target is the source node.
      this.classList.remove('dragged');

      [].forEach.call(document.querySelectorAll('fieldset[dropable]'), function (dropable) {
        dropable.classList.remove('over');
      });
    },
    over: function handleDragOver(ev) {
      if (ev.preventDefault) {
        ev.preventDefault(); // Necessary. Allows us to drop.
      }

      ev.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

      return false;
    },
    enter: function handleDragEnter(ev) {
      // this / e.target is the current hover target.
      this.classList.add('over');
    },
    leave: function handleDragLeave(ev) {
      // this / e.target is previous target element.
      this.classList.remove('over');
    }
  };

  this.drop = function handleDrop(ev) {
    // this / e.target is current target element.

    if (ev.stopPropagation) {
      ev.stopPropagation(); // Stops some browsers from redirecting.
    }

    // Don't do anything if dropping the same element we're dragging.
    if (dragSrcEl != this && ev.target.hasAttribute('dropable')) {
      var mode = dragSrcEl.hasAttribute('dropMode') ? dragSrcEl.getAttribute('dropMode') : THIS.mode;
      switch(mode) {
        case 'moveContent':
          ev.preventDefault();
          var data = ev.dataTransfer.getData("text");
          ev.target.appendChild(document.getElementById(data));
          break;
        case 'moveBefore':
          ev.preventDefault();
          ev.target.parentNode.insertBefore(dragSrcEl, ev.target);
          break;
        case 'copy':
          ev.preventDefault();
          var clone = dragSrcEl.cloneNode();
          clone.innerHTML = dragSrcEl.innerHTML;
          clone.classList.remove('dragged');
          clone.removeAttribute('pattern');
          clone.removeAttribute('dropMode');
          clone.id = 'fieldset-copy-' + (new Date()).getTime() + '-' + Math.round(Math.random()*100)
          ev.target.parentNode.insertBefore(clone, ev.target);
          break;
        case 'toggleHTML':
          // Set the source column's HTML to the HTML of the columnwe dropped on.
          dragSrcEl.innerHTML = this.innerHTML;
          this.innerHTML = ev.dataTransfer.getData('text/html');
          break;
        default:
          alert('DnD mode not defined');
          break;
      }
    }

    return false;
  };

  return {
    init: (draggable, dropable, mode, options) => {
      THIS.mode = mode || 'moveContent';
      this.draggable = document.querySelectorAll(draggable);
      this.dropable = document.querySelectorAll(dropable);

      [].forEach.call(this.dropable, item => {
        item.addEventListener('dragenter',  this.drag.enter, false);
        item.addEventListener('dragover',   this.drag.over, false);
        item.addEventListener('dragleave',  this.drag.leave, false);
        item.addEventListener('drop',       this.drop, false);
        if (options && options.hasOwnProperty('afterDrop'))
          item.addEventListener('drop',       options.afterDrop, false);
      });
      [].forEach.call(this.draggable, item => {
        item.addEventListener('dragstart',  this.drag.start, false);
        item.addEventListener('dragend',    this.drag.end, false);
      });
    }
  }
})()
