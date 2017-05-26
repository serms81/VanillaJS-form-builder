var konsole = (function() {
  var konsole = document.querySelector('.console-inner');
  this.log = function () {
    var args = Array.prototype.slice.call(arguments);
    args.forEach((e,i) => {
      var log = document.createElement('p');
      log.textContent = '>' + (typeof e == 'Object' ? JSON.stringify(e) : e);
      konsole.appendChild(log);
    });
  }
  return {
    log: this.log
  }
})();

var defParser = function(fieldDefinitions) {

  var DEFAULT_SUBMIT = {
    type: 'submit',
    label: 'Submit',
    resetable: {
      label: true
    }
  };

  var toEditable = function(component) {
    component = component || null;
    if (component) {
      component.style.cursor = 'text';
      component.setAttribute('resetable', true);
      component.addEventListener('dblclick', function(ev) {
        this.setAttribute('contenteditable', true);
      });
      component.addEventListener('blur', function(ev) {
        this.setAttribute('contenteditable', false);
        if (this.tagName.toLowerCase() == 'label')
          this.textContent = this.textContent.trim();
        else if (this.tagName.toLowerCase() == 'div')
          this.innerHTML = this.innerHTML.trim();
      });
    }
    return component;
  }

  var getPattern = function(pattern_name) {
    switch (pattern_name) {
      case 'fieldset':
        var fieldset = document.createElement('fieldset');
        fieldset.setAttribute('dropable', true);
        fieldset.setAttribute('draggable', true);
        return fieldset;
        break;
      default:
        return document.createElement('div');
    }
  }

  var saveMeta = function (fieldset, definitionToMerge) {
    var hasOriginal = (() => fieldset.querySelector('meta[name="fieldset-definition"]'))();
    var hasCurrent = (() => fieldset.querySelector('meta[name="current-definition"]'))();

    if (!fieldset || !definitionToMerge || !hasOriginal)
      return;

    var originalDef = hasOriginal;
    var currentDef  = hasCurrent ? fieldset.querySelector('meta[name="current-definition"]')
                                 : document.createElement('meta');
    var originalContent = originalDef.getAttribute('content');
    var currentContent  = currentDef.getAttribute('content') || '{}';
    var newContent      = JSON.stringify(Object.assign(
      JSON.parse(originalContent), JSON.parse(currentContent), definitionToMerge 
    ));

    if (originalContent == newContent) {
      fieldset.removeAttribute('data-modified');
      if (hasCurrent)
        currentDef.parentElement.removeChild(currentDef);
      return;
    }

    fieldset.setAttribute('data-modified', true);
    currentDef.setAttribute('name', 'current-definition');
    currentDef.setAttribute('content', newContent);
    fieldset.appendChild(currentDef);
  }

  var getSchema = function() {
    konsole.log('defParser -- getSchema');
    var fieldsetDefinitions = document.querySelectorAll('meta[name="fieldset-definition"]');
    var schema = [];
    fieldsetDefinitions.forEach(function(curr) {
      var content = curr.getAttribute('content');
      konsole.log(content);
      schema.push(JSON.parse(content));
    });
    if (JSON.stringify(schema).indexOf('submit') < 0) {
      schema.push(Object.assign(DEFAULT_SUBMIT, {label: document.querySelector('[type="submit"]').textContent}));
    }
    konsole.log('defParser ------------');
    return schema;
  }

  var Field = function(def) {
    if (!(this instanceof Field)) return new Field(def);

    this.def = def;
    this.nodeElement = null;

    var DEFAULTS = {
      name: false,
      type: false,
      required: false,
      placeholder: false,
      label: false,
      text: false,
      html: false,
      resetable: {
        required: false,
        placeholder: false,
        label: false,
        text: false,
        html: false,
      }
    };

    this.set = {
      type: () => {
        var _field = null;

        switch(this.def.type) {
          case 'submit':
            _field = document.createElement('span');
            _field.classList.add('btn');
            _field.classList.add('btn-primary');
            _field.setAttribute('resetable', true);
            _field.textContent = this.def.label;
            delete this.def.label;
            break;
          case 'text':
          case 'number':
          case 'email':
          case 'tel':
          case 'checkbox':
          case 'radiobutton':
            _field = document.createElement('input');
            _field.setAttribute('type', this.def.type);
            break;
          case 'header':
            _field = toEditable(document.createElement('h3'));
            _field.textContent = this.def.hasOwnProperty('text') ? this.def.text : 'Título';
            break;
          case 'paragraph':
            _field = toEditable(document.createElement('p'));
            _field.textContent = this.def.hasOwnProperty('text') ? this.def.text : 'Párrafo';
            break;
          case 'separator':
            _field = document.createElement('hr');
            break;
          case 'textarea':
            _field = document.createElement('textarea');
            break;
          case 'select':
            _field = document.createElement('select');
            if (this.def.hasOwnProperty('options') && this.def.options && this.def.options.length) {
              this.def.options.unshift({null: 'Selecciona uno'});
              for ( var opt of this.def.options) {
                var option = document.createElement('option');
                for (var key in opt) {
                  option.value = key;
                  option.text = opt[key];
                }
                _field.appendChild(option);
              }
            }
            break;
          case 'autocomplete':
            _field = document.createElement('div');
            var input = document.createElement('input');
            var datalist = document.createElement('datalist');
            input.setAttribute('list', this.def.name + 'Options');
            datalist.setAttribute('id', this.def.name + 'Options');
            _field.appendChild(input);
            _field.appendChild(datalist);
            for(var opt of this.def.options) {
              var option = document.createElement('option');
              for (var key in opt) {
                option.value = opt[key];
              }
              datalist.appendChild(option);
            }
            break;
          case 'range':
            _field = document.createElement('div');
            var range = document.createElement('input');
            var counter = document.createElement('span');
            range.setAttribute('type', this.def.type);
            range.setAttribute('min', this.def.hasOwnProperty('min') ? this.def.min : 1);
            range.setAttribute('max', this.def.hasOwnProperty('max') ? this.def.max : 10);
            range.setAttribute('step', this.def.hasOwnProperty('step') ? this.def.step : 1);
            range.setAttribute('value', 200);
            _field.appendChild(counter);
            _field.appendChild(range);
            range.onchange = function() {
              this.previousElementSibling.textContent = this.value + '€';
            }
            range.onmousemove = range.onchange;
            range.onchange();
            break;
          case 'acceptance':
            this.nodeElement = document.createElement('div');
            var accept = Object.assign({}, this.def);
            delete this.def.label;
            delete accept.disclaimer;
            accept.type = 'accept';
            var input = new Field(accept);
            this.set.html();
            this.nodeElement.appendChild(input.nodeElement);
            this.nodeElement.appendChild(input.get.labelNode());
            _field = this.nodeElement;
            break;
          case 'accept':
            _field = document.createElement('input');
            _field.setAttribute('type', 'checkbox');
            break;
          default:
            _field = document.createElement('div');
            _field.innerHTML = '<small>Undefined type <em>'+this.def.type+'</em></small>';
        }

        this.nodeElement = _field;

        return this;
      },
      name: () => {
        this.name = this.def.name;
        if (this.def.name && this.nodeElement) {
          this.nodeElement.setAttribute('name', this.def.name);
          this.nodeElement.setAttribute('title', this.def.name);
        }
        return this;
      },
      placeholder: () => {
        this.placeholder = this.def.placeholder;
        if (this.def.placeholder && this.nodeElement) {
          this.nodeElement.setAttribute('placeholder', this.def.placeholder);
          if (this.def.resetable.placeholder)
            this.nodeElement.setAttribute('resetable', true);
        }
        return this;
      },
      required: () => {
        this.required = this.def.required;
        if (this.def.required && this.nodeElement) {
          this.nodeElement.setAttribute('required', this.def.required);
        }
        return this;
      },
      label: () => {
        this.labelNode = null;
        if (this.def.label && this.nodeElement) {
          this.labelNode = document.createElement('label');
          this.labelNode.textContent = this.def.label;
          if (this.def.resetable.label)
            this.labelNode = toEditable(this.labelNode);
        }
        return this;
      },
      html: () => {
        this.html = null;
        if (this.def.type == 'acceptance' && this.def.hasOwnProperty('disclaimer'))
          this.def.html = this.def.disclaimer;
        if (this.def.html && this.nodeElement) {
          this.html = document.createElement('div');
          this.html.innerHTML = this.def.html;
          if (this.def.resetable.html)
            this.html = toEditable(this.html);
          this.nodeElement.appendChild(this.html);
        }
        return this;
      }
    };

    this.get = {
      labelNode: () => {
        return this.set.label().labelNode;
      }
    }

    var init = () => {
      this.def = Object.assign({}, DEFAULTS, def);
      this.set.type().set.name().set.placeholder().set.required();
    };

    init();

    return this;
  }

  var Fieldset = function(def) {
    if (!(this instanceof Fieldset)) return new Fieldset(def);

    this.def = def;
    var field = new Field(def);
    if (!field) return;

    var isSubmit = def.type == 'submit';
    var isFieldset = field.nodeElement.tagName.toLowerCase() == 'fieldset';
    var fieldset = isFieldset ? field : getPattern('fieldset');
    var fieldsetId = (def) => ['fieldset', def.type, (new Date()).getTime(), Math.round(Math.random()*100)].join('_');
    if (isSubmit)
      fieldset.removeAttribute('draggable');
    fieldset.removeAttribute('pattern');
    fieldset.removeAttribute('dropMode');
    fieldset.setAttribute('id', fieldsetId(def));

    var metaDef = document.createElement('meta');
    metaDef.setAttribute('name', 'fieldset-definition');
    metaDef.setAttribute('content', JSON.stringify(def));
    fieldset.appendChild(metaDef);

    if (def.required)
      fieldset.setAttribute('required', def.required);

    if (!isFieldset) {
      var label = field.get.labelNode();
      if (label && def.type != 'accept')
        fieldset.appendChild(label);
      fieldset.appendChild(field.nodeElement);
      if (label && def.type == 'accept')
        fieldset.appendChild(label);
    }

    this.nodeElement = fieldset;

    return this;
  }

  if (!fieldDefinitions) {
    return {
      saveFieldsetDef: saveMeta,
      getSchema: getSchema
    }
  }

  fieldDefinitions.forEach(function(def) {
    var fieldset = new Fieldset(def);
    if (!fieldset) return;

    // prevent child fieldset of being dropable or draggable
    var child = fieldset.nodeElement.querySelectorAll('fieldset[dropable][draggable]');
    for (var item of child) {
      var newDiv = document.createElement('div');
      newDiv.innerHTML = item.innerHTML;
      // and recover events for resetable items
      for (var resetable of newDiv.querySelectorAll('[resetable]'))
        resetable.parentNode.replaceChild(toEditable(resetable), resetable);
      item.parentNode.replaceChild(newDiv, item);
    }

    if (def.name) {
      fieldset.nodeElement.setAttribute('title', 'Campo para: ' + def.name);
      fieldset.nodeElement.setAttribute('name', 'fieldset_' + def.name);
    }

    var available_wrapper = document.getElementById('available_wrapper');
    var available_alerts = document.getElementById('available_alerts');
    var placeholder_wrapper = document.getElementById('placeholder_wrapper');
    var selected_wrapper = document.getElementById('selected_wrapper');
    var submit_wrapper = document.getElementById('submit_wrapper');

    if (def.hasOwnProperty('name') || def.type == 'submit')
      submit_wrapper.parentNode.insertBefore(fieldset.nodeElement, submit_wrapper);
    else
      placeholder_wrapper.parentNode.insertBefore(fieldset.nodeElement, placeholder_wrapper);
    
    if (def.type == 'submit')
      submit_wrapper.parentElement.removeChild(submit_wrapper);

  });

}

JSON.diffs = function diffs(obj1, obj2) {
    var result = {};
    for(var key in obj1) {
        if(obj2[key] != obj1[key])
          result[key] = obj2[key];
        if(typeof obj2[key] == 'Array' && typeof obj1[key] == 'Array') 
            result[key] = arguments.callee(obj1[key], obj2[key]);
        if(typeof obj2[key] == 'Object' && typeof obj1[key] == 'Object') 
            result[key] = arguments.callee(obj1[key], obj2[key]);
    }
    return result;
}