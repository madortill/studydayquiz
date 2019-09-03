var indexables = [String, Array];

function addToProto(func, ...types) {
  for (type of types) {
    type.prototype[func.name] = func;
  }
}

addToProto(function removeIndex(index) {
  return index
    ? this.slice(0, index).concat(this.slice(index + 1))
    : this.slice(1);
}, ...indexables);

addToProto(function removeRange(startIndex, endIndex) {
  return this.slice(0, startIndex).concat(this.slice(endIndex + 1));
}, ...indexables);

addToProto(function appendAt(startIndex, append) {
  return this.slice(0, startIndex)
    .concat(append)
    .concat(this.slice(startIndex));
}, ...indexables);

addToProto(function replaceAt(startIndex, length, replacement) {
  return this.slice(0, startIndex)
    .concat(replacement)
    .concat(this.slice(startIndex + length));
}, ...indexables);

addToProto(function indexOrEnd(search, index) {
  var index = str.indexOf(search, index);
  return index == -1 ? str.length : index;
}, ...indexables);

Object.either = (obj, other) => (obj ? obj : other);
/**
 * Creates a context for templating.
 * @param {HTMLElement} element the element of this context.
 * @param {*} dict other properties for the context.
 */
function mkContext(element, dict) {
  return Object.assign(
    {
      chosen: {
        el: element,
        text: element.innerHTML,
        id: element.option
      }
    },
    dict
  );
}

/**
 * Creates a context for templating for the endscreen.
 * @param {*} dict other properties for the context.
 */
function mkEndContext(dict) {
  return Object.assign(
    {
      wrong: wrong,
      finishTime: document.getElementsByTagName("timer")[0].innerHTML
    },
    dict
  );
}

//Utility function for sleeping in js.
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Parses replaceable parts in a template.
 * @param {string} template the template string.
 */
function parseReplaceables(template) {
  //The return value.
  var replaceables = {};
  var skip = false;
  var str;
  //Checks every charecter in the template strings
  for (let i = 0; i < template.length; i++) {
    if (skip) continue;
    const element = template[i];
    switch (element) {
      //If the charecter is '{' start collecting the string.
      case "{":
        str = "";
        break;
      case "}":
        //Add a replaceable with the text collected
        if (str != undefined) {
          replaceables[i - str.length] = str;
          str = undefined;
        }
        break;
      case "\\":
        //Skip a charecter if the charecter is a '\'
        skip = true;
        break;
      default:
        //Add a charecter to the string.
        if (str != undefined) str += element;
    }
  }
  return replaceables;
}

/**
 * This function resloves a templates {Code} in .
 * @param {Map} context the dictionary for the templating.
 * @param {String} template the template to reslove for the given context.
 */
function resolveEval(template) {
  var toReplace = parseReplaceables(template);
  //replaces all the replaceable parts.
  for (var prop in toReplace) {
    var vName = toReplace[prop];
    template = template.replaceAt(prop - 1, vName.length + 2, eval(vName));
  }
  return template;
}

/**
 * This function resloves a templates {Code} in .
 * @param {Map} context the dictionary for the templating.
 * @param {String} template the template to reslove for the given context.
 */
function resolve(context, template) {
  var toReplace = parseReplaceables(template);
  var offset = 0;
  //replaces all the replaceable parts with the context.
  for (var prop in toReplace) {
    //Access a property(a.b) of the currect object untill there is no '.' left in the string to replace.
    //The string to replace.
    var vName = toReplace[prop];
    //check if and where there is a '.' in the string to replace.
    var index = indexOfOrEnd(vName, 0, ".");
    //Access the first object in the context.
    var current = context[vName.substring(0, index)];
    //While there is a property matching in the replaceable and the the replaceable part is not wholly used.
    while (current && index != vName.length) {
      var temp = index + 1;
      index = indexOfOrEnd(vName, temp, ".");
      //Access the property of the current object based on the replaceable part.
      current = current[vName.substring(temp, index + 1)];
    }
    //Replace the replaceable part with the result of it's reloving.
    template = template.replaceAt(
      offset + Number(prop) - 1,
      vName.length + 2,
      current
    );
    //Calculate how much you moved the next replaceable part.
    offset = String(current).length - vName.length - 2;
  }
  return template;
}

/**
 * searches for a string inside a string and returns it, unless it's not found and then it returns the last position in the string.
 * @param {string} str the string to search inside of.
 * @param {Number} position the index to start searching at.
 * @param {string} searchString the string to search for.
 */
function indexOfOrEnd(str, position, searchString) {
  var position = str.indexOf(searchString, position);
  return position == -1 ? str.length : position;
}
