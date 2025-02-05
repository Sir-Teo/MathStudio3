const notebook = document.getElementById('notebook');
const variableState = document.getElementById('variableState');
let evaluationCount = 0;
const scope = {};

// --- Custom Plotting Functions Integration ---

// Helper function to generate x values
function generateXValues(xMin, xMax, numPoints = 100) {
  const step = (xMax - xMin) / numPoints;
  return math.range(xMin, xMax, step, true).toArray();
}

// 1. Line Plot: plot(expr, xMin, xMax, options)
scope.plot = function(expr, xMin, xMax, options) {
  const xValues = generateXValues(xMin, xMax);
  const compiled = math.compile(expr);
  const yValues = xValues.map(x => compiled.evaluate({ x }));
  return {
    __plotly: true,
    data: [{
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines'
    }],
    layout: Object.assign({ 
      title: `Plot of ${expr}`,
      margin: { t: 40 }
    }, options || {})
  };
};

// 2. Scatter Plot: scatter(expr, xMin, xMax, options)
scope.scatter = function(expr, xMin, xMax, options) {
  const xValues = generateXValues(xMin, xMax);
  const compiled = math.compile(expr);
  const yValues = xValues.map(x => compiled.evaluate({ x }));
  return {
    __plotly: true,
    data: [{
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'markers'
    }],
    layout: Object.assign({
      title: `Scatter Plot of ${expr}`,
      margin: { t: 40 }
    }, options || {})
  };
};

// 3. Bar Plot: barPlot(expr, xMin, xMax, options)
scope.barPlot = function(expr, xMin, xMax, options) {
  const xValues = generateXValues(xMin, xMax, 20); // fewer points for bars
  const compiled = math.compile(expr);
  const yValues = xValues.map(x => compiled.evaluate({ x }));
  return {
    __plotly: true,
    data: [{
      x: xValues,
      y: yValues,
      type: 'bar'
    }],
    layout: Object.assign({
      title: `Bar Plot of ${expr}`,
      margin: { t: 40 }
    }, options || {})
  };
};

// 4. Histogram Plot: histPlot(data, options)
scope.histPlot = function(data, options) {
  if (data && typeof data.toArray === 'function') {
    data = data.toArray();
  }
  if (!Array.isArray(data)) {
    throw new Error("histPlot expects an array of numbers as the first argument.");
  }
  return {
    __plotly: true,
    data: [{
      x: data,
      type: 'histogram'
    }],
    layout: Object.assign({
      title: 'Histogram',
      margin: { t: 40 }
    }, options || {})
  };
};

// 5. Polar Plot: polarPlot(expr, thetaMin, thetaMax, options)
scope.polarPlot = function(expr, thetaMin, thetaMax, options) {
  const numPoints = 100;
  const thetaValues = math.range(thetaMin, thetaMax, (thetaMax - thetaMin) / numPoints, true).toArray();
  const compiled = math.compile(expr);
  const rValues = thetaValues.map(theta => compiled.evaluate({ theta }));
  const xValues = thetaValues.map((theta, i) => rValues[i] * Math.cos(theta));
  const yValues = thetaValues.map((theta, i) => rValues[i] * Math.sin(theta));
  return {
    __plotly: true,
    data: [{
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines'
    }],
    layout: Object.assign({
      title: `Polar Plot of ${expr}`,
      xaxis: { title: 'x' },
      yaxis: { title: 'y' },
      margin: { t: 40 }
    }, options || {})
  };
};

// --- End of Custom Plotting Functions ---

function createNewCell() {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.innerHTML = `
    <div class="input-area">
      <span class="cell-number">In[*]:</span>
      <input type="text" class="input-field" placeholder="Enter mathematical expression...">
    </div>
    <div class="output-area">
      <span class="cell-number">Out[*]:</span>
      <span class="result"></span>
    </div>
  `;
  notebook.appendChild(cell);
  return cell.querySelector('.input-field');
}

function updateVariableState() {
  const stateDisplay = Object.entries(scope)
    .filter(([key, value]) => !key.startsWith('_'))
    .map(([key, value]) => `${key} = ${JSON.stringify(value)}`)
    .join('\n');
  variableState.textContent = stateDisplay;
}

function updateCellNumbers(currentCell, evaluationNumber) {
  const inputLabel = currentCell.querySelector('.input-area .cell-number');
  const outputLabel = currentCell.querySelector('.output-area .cell-number');
  inputLabel.textContent = `In[${evaluationNumber}]:`;
  outputLabel.textContent = `Out[${evaluationNumber}]:`;
}

// Convert the evaluated result to LaTeX (if possible)
function toLatex(result) {
  // If the result is a number or a simple string, just return it.
  if (typeof result === 'number' || typeof result === 'string') {
    return result;
  }
  // Attempt to use math.parse and toTex if possible.
  try {
    // Note: This conversion might not work for every type.
    return math.parse(result.toString()).toTex();
  } catch (e) {
    return result.toString();
  }
}

function evaluateExpression(input, cell) {
  const outputElement = cell.querySelector('.result');
  try {
    // Special command "Amy"
    if (input.trim() === 'Amy') {
      evaluationCount++;
      updateCellNumbers(cell, evaluationCount);
      outputElement.textContent = 'cmllkagqd🥚';
      scope[`_${evaluationCount}`] = 'cmllkagqd🥚';
      updateVariableState();
      return true;
    }
    
    evaluationCount++;
    updateCellNumbers(cell, evaluationCount);
    
    // Evaluate the expression within the persistent scope.
    const result = math.evaluate(input, scope);
    
    // If the result is flagged for Plotly rendering, embed a plot.
    if (result && result.__plotly) {
      outputElement.innerHTML = `<div id="plot-${evaluationCount}" style="width:100%; height:400px;"></div>`;
      Plotly.newPlot(`plot-${evaluationCount}`, result.data, result.layout);
    } else {
      // Convert the result to LaTeX and wrap in delimiters.
      const latexResult = toLatex(result);
      outputElement.innerHTML = `\\( ${latexResult} \\)`;
      // Tell MathJax to typeset the new content.
      MathJax.typesetPromise([outputElement]);
    }
    
    // Save the result in the scope as _1, _2, etc.
    scope[`_${evaluationCount}`] = result;
    
    // Update the variable state display.
    updateVariableState();
    
    return true;
  } catch (error) {
    outputElement.textContent = error.message;
    outputElement.className = 'result error';
    return false;
  }
}

// Handle input events: press Enter to evaluate and then create a new cell.
notebook.addEventListener('keydown', (event) => {
  if (event.target.classList.contains('input-field') && event.key === 'Enter') {
    const currentCell = event.target.closest('.cell');
    const success = evaluateExpression(event.target.value, currentCell);
    
    // Only create a new cell if this is the last cell.
    const isLastCell = currentCell === notebook.lastElementChild;
    if (success && isLastCell) {
      const newInput = createNewCell();
      newInput.focus();
    }
  }
});

// Focus the first input field.
document.querySelector('.input-field').focus();
