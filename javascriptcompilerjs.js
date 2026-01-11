setTimeout(() => {
    document.getElementById('splash-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
}, 3000);
		
const editor = document.getElementById('editor');
const keywords = ['abstract', 'arguments', 'async', 'await', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 'debugger', 
'default', 'delete', 'do', 'double', 'else', 'enum', 'eval', 'export', 'extends', 'false', 'final', 'finally', 'float', 'for', 'function', 'goto', 'if', 
'implements', 'import', 'in', 'instanceof', 'int', 'interface', 'let', 'long', 'native', 'new', 'null', 'package', 'private', 'protected', 'public', 'return',
'short', 'static', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'true', 'try', 'typeof', 'undefined', 'var', 'void', 'volatile', 
'while', 'with', 'yield'];
const numberinteger = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const brackets = ['(',')','[',']','{','}'];
const lineNumbers = document.getElementById('line-numbers');
const maxLines = 40; 
for (let i = 1; i <= maxLines; i++) {
const lineNumber = document.createElement('div');
	lineNumber.textContent = i;
	lineNumbers.appendChild(lineNumber);
}
					
editor.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const br = document.createElement('br');
    range.deleteContents();
    range.insertNode(br);
    range.setStartAfter(br);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    const text = editor.innerText;
    const words = text.split(/(\W)/);
    let html = '';
    let caretPosition = getCaretPosition(editor);
    words.forEach(word => {
      if (keywords.includes(word)) {
        html += `<span class="keyword">${word}</span>`;
      } else if (!isNaN(word) && word !== '') {
        html += `<span class="numberinteger">${word}</span>`;
      } else {
        html += word;
      }
    });
    editor.innerHTML = html;
    setCaretPosition(editor, caretPosition + 1);
  }
});

editor.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    const text = editor.innerText;
    const words = text.split(/(\W)/);
    let html = '';
    let caretPosition = getCaretPosition(editor);
    words.forEach(word => {
      if (keywords.includes(word)) {
        html += `<span class="keyword">${word}</span>`;
      } else if (!isNaN(word) && word !== '') {
        html += `<span class="numberinteger">${word}</span>`;
      } else {
        html += word;
      }
    });
    editor.innerHTML = html;
    setCaretPosition(editor, caretPosition);
  }
});
	
editor.addEventListener('input', (e) => {
    if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
        return;
    }
    const text = editor.innerText;
    const words = text.split(/(\W)/);
    let html = '';
    let caretPosition = getCaretPosition(editor);
words.forEach(word => {
  if (keywords.includes(word)) {
    html += `<span class="keyword">${word}</span>`;
  } else if (!isNaN(word) && word !== '') {
    html += `<span class="numberinteger">${word}</span>`;
  } else if (brackets.includes(word)) {
    html += `<span class="brackets">${word}</span>`;
  } else {
    html += word;
  }
});
    	editor.innerHTML = html;
        setCaretPosition(editor, caretPosition);
});

function getCaretPosition(element) {
    let position = 0;
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.startContainer, range.startOffset);
        position = preCaretRange.toString().length;
    }
    return position;
}

function setCaretPosition(element, position) {
    const range = document.createRange();
    const textNodes = getTextNodes(element);
    let currentNode = null;
    let currentIndex = 0;
    for (let i = 0; i < textNodes.length; i++) {
        const node = textNodes[i];
        const nodeLength = node.textContent.length;
        if (currentIndex + nodeLength >= position) {
            currentNode = node;
            break;
        }
        currentIndex += nodeLength;
    }
    if (currentNode) {
        range.setStart(currentNode, position - currentIndex);
        range.setEnd(currentNode, position - currentIndex);
    } else {
        range.setStart(element, 0);
        range.setEnd(element, 0);
    }
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}
	
function getTextNodes(element) {
    const nodes = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node;
    while (node = walker.nextNode()) {
        nodes.push(node);
    }
    return nodes;
}
    document.querySelectorAll('.run-btn')[1].addEventListener('click', function(){
    document.getElementById('editor').innerText = '';
});

const runBtn = document.querySelectorAll('.run-btn')[0];
const output = document.getElementById('output');
const consoleOutput = document.getElementById('console-output');
runBtn.addEventListener('click', () => {
    try {
        const code = editor.innerText;
        const result = eval(code);
        output.innerText = `${result}`;
        consoleOutput.value = '';
        eval(code);
    } catch (error) {
        output.innerText = `// Error:\n${error.message}`;
    }
});
                    
const originalConsoleLog = console.log;
console.log = function(...args) {
    originalConsoleLog(...args);
    consoleOutput.value += args.join(' ') + '\n';
};
document.getElementById('clear-console-btn').addEventListener('click', function() {
    document.getElementById('console-output').value = '';
    document.getElementById('output').innerText = '';
});
const cursor = document.querySelector('.cursor');
function updateCursor(event) {
    cursor.style.top = event.clientY + 'px';
    cursor.style.left = event.clientX + 'px';
}
document.addEventListener('mousemove', updateCursor);
