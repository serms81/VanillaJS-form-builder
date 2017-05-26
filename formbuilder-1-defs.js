var DEFAULT_FIELDS = [
  {
    type: 'header',
    text: 'Título'
  },
  {
    type: 'paragraph',
    text: 'Esto es un párrafo.'
  },
  {
    type: 'separator',
    html: '<hr>'
  }
];

var OTHER_TYPE_FIELDS = [
  {
    name: 'hijos',
    type: 'number',
    label: 'Hijos',
    placeholder: 'Hijos',
    resetable: {
      label: true,
      placeholder: true
    }
  },
  {
    name: 'altura',
    type: 'select',
    label: 'Elije uno',
    options: [
      {bajo: 'Bajo'},
      {alto: 'Alto'}
    ],
    resetable: {
      label: true,
      placeholder: true
    }
  },
  {
    name: 'ahorro_mensual',
    type: 'range',
    label: 'Capacidad de ahorro mensual',
    max: 200,
    min: 10,
    step: 10,
    resetable: {
      label: true,
      placeholder: true
    }
  },
  {
    name: 'color_pelo',
    type: 'autocomplete',
    label: 'Color de pelo',
    options: [
      {Rubio: 'Rubio'},
      {Moreno: 'Moreno'}
    ],
    resetable: {
      label: true,
      placeholder: true
    }
  },
  {
    name: 'genero',
    type: 'radiobuttons',
    label: 'Elige uno',
    options: [
      {V: 'Don'},
      {M: 'Doña'}
    ],
    resetable: {
      label: true,
      placeholder: true
    }
  },
  {
    name: 'vicio_bebedor',
    type: 'checkbox',
    label: 'Bebedor'
  },
  {
    name: 'vicios',
    type: 'checkboxes',
    label: 'Fumador',
    options: [
      {fumador: 'Fumador'}
    ],
    resetable: {
      label: true,
      placeholder: true
    }
  },
  {
    name: 'fisiologia',
    type: 'checkboxes',
    label: 'Elige si corresponde',
    options: [
      {1: 'Rubio'},
      {2: 'Ojos azules'}
    ],
    resetable: {
      label: true,
      placeholder: true
    }
  }
];

var BASE = [
  {
    name: 'nombre',
    type: 'text',
    label: 'Nombre',
    placeholder: 'Nombre',
    required: true,
    resetable: {
      placeholder: true
    }
  },
  {
    name: 'apellidos',
    type: 'text',
    label: 'Apellidos',
    placeholder: 'Apellidos',
    required: true,
    resetable: {
      placeholder: true
    }
  },
  {
    name: 'telefono',
    type: 'tel',
    label: 'Teléfono',
    placeholder: 'Teléfono',
    required: true,
    resetable: {
      label: true,
      placeholder: true
    }
  },
  {
    name: 'email',
    type: 'email',
    label: 'Correo electrónico',
    placeholder: 'Correo electrónico',
    required: true,
    resetable: {
      label: true,
      placeholder: true
    }
  }
];

var OKIS = [
  {
    name: 'accept',
    type: 'acceptance',
    label: 'Acepto las condiciones',
    required: true,
    disclaimer: '<p>Estas son las <a>condiciones</a>.</p><p>Este bloque será <b>reemplazado</b> por el de cliente, o el <i>default</i>.</p>',
    resetable: {
      label: true
    }
  }
];

var COD_POSTAL = [
  {
    name: 'cod_postal',
    type: 'text',
    label: 'Código postal',
    placeholder: 'Código postal',
    required: true,
    resetable: {
      label: true,
      placeholder: true
    }
  }
];

var NIF = [
  {
    name: 'dni',
    type: 'text',
    label: 'Nº Documento identidad',
    placeholder: 'Nº Documento identidad',
    required: true,
    resetable: {
      label: true,
      placeholder: true
    }
  }
];

var PAIS = [
  {
    name: 'pais_nombre',
    type: 'select',
    options: [
      {España: 'España'},
      {Argentina: 'Argentina'},
      {Perú: 'Perú'}
    ],
    label: 'País',
    placeholder: 'País',
    required: true,
    resetable: {
      label: true,
      placeholder: true
    }
  }
];

var PROVINCIA = [
  {
    name: 'provincia_id',
    type: 'select',
    options: [
      {Alicante: 'Alicante'},
      {Castellón: 'Castellón'},
      {Valencia: 'Valencia'}
    ],
    label: 'Provincia',
    placeholder: 'Provincia',
    required: true,
    resetable: {
      label: true,
      placeholder: true
    }
  }
];

var POBLACION = [
  {
    name: 'poblacion',
    type: 'text',
    label: 'Población',
    placeholder: 'Población',
    required: true,
    resetable: {
      label: true,
      placeholder: true
    }
  }
];

var IMPORTE_SOLICITADO = [
  {
    name: 'importe_solicitado',
    type: 'number',
    label: 'Importe solicitado',
    placeholder: 'Importe solicitado',
    required: true,
    resetable: {
      label: true,
      placeholder: true
    }
  }
];

var COMENTARIOS = [
  {
    name: 'comentarios',
    type: 'textarea',
    label: 'Comentarios',
    placeholder: 'Escriba aquí sus comentarios',
    resetable: {
      label: true,
      placeholder: true
    }
  }
];

var SUBMIT = [{
      type: 'submit',
      label: 'Enviar',
      resetable: {
        label: true
      }
    }];

var FIELDS = [
  BASE,
  NIF,
  COD_POSTAL,
  POBLACION,
  PROVINCIA,
  PAIS,
  IMPORTE_SOLICITADO,
  COMENTARIOS,
  OKIS,
  DEFAULT_FIELDS,
  OTHER_TYPE_FIELDS
].reduce( (prev, curr, i, array) => prev.concat(curr) );
