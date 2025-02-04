
# MathStudio3

A lightweight, in-browser computational notebook that emulates some of the functionality of Mathematica. This project uses [math.js](https://mathjs.org/) for mathematical evaluations and [Plotly.js](https://plotly.com/javascript/) for interactive plotting. Please try it out [here](https://sir-teo.github.io/MathStudio3/).

## Features

- **Interactive Notebook Interface:**  
  Each cell contains an input field and an output area. When you press Enter, your expression is evaluated and the result is displayed below.

- **Persistent Scope:**  
  All variables and functions are stored in a persistent scope, so later cells can reference results from previous cells.

- **Custom Plotting Functions:**  
  In addition to basic numerical evaluation, the notebook includes several custom plotting functions:
  - **`plot(expr, xMin, xMax, options)`**: Generates a standard line plot.
  - **`scatter(expr, xMin, xMax, options)`**: Creates a scatter plot.
  - **`barPlot(expr, xMin, xMax, options)`**: Produces a bar chart.
  - **`histPlot(data, options)`**: Displays a histogram from an array of numbers (or a math.js matrix converted to an array).
  - **`polarPlot(expr, thetaMin, thetaMax, options)`**: Plots a function defined in polar coordinates.

- **Live Variable State Display:**  
  The current state of the persistent scope is shown in a history panel on the page.

## Getting Started

### Prerequisites

The project is entirely client-side. It requires an Internet connection to load the following libraries from their CDNs:
- [math.js](https://cdnjs.com/libraries/mathjs)
- [Plotly.js](https://cdn.plot.ly/plotly-latest.min.js)

### Running the Notebook

1. **Clone or Download the Repository:**

   ```bash
   git clone https://github.com/yourusername/web-mathematica-clone.git
   cd web-mathematica-clone
   ```

2. **Open the `index.html` File:**  
   Open `index.html` in your favorite web browser. No additional server or build process is required.

## Usage Examples

Below are several examples to try in your notebook cells:

- **Line Plot:**  
  Plot \( x^2 \) from \(-10\) to \(10\):
  ```mathematica
  plot("x^2", -10, 10)
  ```

- **Scatter Plot:**  
  Create a scatter plot of \(\sin(x)\) from \(-6.28\) to \(6.28\):
  ```mathematica
  scatter("sin(x)", -6.28, 6.28)
  ```

- **Bar Plot:**  
  Generate a bar plot of \( x \) over the range \(-10\) to \(10\):
  ```mathematica
  barPlot("x", -10, 10)
  ```

- **Histogram Plot:**  
  Create a histogram from an array of numbers:
  ```mathematica
  histPlot([1, 2, 2, 3, 3, 3, 4, 4, 4, 4])
  ```
- **Polar Plot:**  
  Plot the polar function \( r = \sin(3\theta) \) from \(0\) to \(2\pi\):
  ```mathematica
  polarPlot("sin(3*theta)", 0, 6.28)
  ```


## Acknowledgments

- [math.js](https://mathjs.org/) for powerful mathematical computations.
- [Plotly.js](https://plotly.com/javascript/) for interactive plotting.
```
