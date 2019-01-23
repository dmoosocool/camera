import { cube } from '../components/input';
import { random } from 'lodash-es';

function component() {
  var element = document.createElement('pre');
  element.innerHTML = ['hello webpack', '5 cubed is equal to ' + cube(5) ].join('\n\n');
  return element;
}

document.body.appendChild(component());
var tips = document.createElement('pre');
tips.innerHTML = ['random number', 'is ' + random(0,9)].join('\n\n');

document.body.appendChild(tips);

// console.log('hello world2');