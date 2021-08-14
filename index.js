console.clear();

const BUTTON_STOP = { state: true, element: document.getElementById("stop") };
const CONTAINER = document.getElementById("container");
const POLYGON = document.getElementById("polygon");
let lastColorIsAscending = true;
let requestAnimationFrameId = null;
let backgroundStyle = document.body.style;

function _Main() {
  _Render([0, 0, 0], 0);
}

function _Render(color, rotation) {
  _DrawPolygon(POLYGON, color, 5, 64, rotation);

  requestAnimationFrameId = requestAnimationFrame(() => {
    _Render(_NewColor(color), rotation + 0.008);
  });
}

function _NewColor(lastColor) {
  if (lastColor[0] > 255 && lastColorIsAscending) {
    lastColorIsAscending = false;
  }
  if (lastColor[0] < 0 && !lastColorIsAscending) {
    lastColorIsAscending = true;
  }

  return (lastColor = lastColor.map((value) => {
    const NEW_VALUE = 255 - value;
    backgroundStyle.background = `rgb(${NEW_VALUE},${NEW_VALUE},${NEW_VALUE})`;
    
    return lastColorIsAscending ? value + 1 : value - 1;
  }));
}

function _DrawPolygon(polygon, color, noOfSides, circumradius, rotation) {
  polygon.setAttribute(
    "points",
    _GeneratePoints(noOfSides, circumradius, rotation)
  );

  polygon.setAttribute("fill", `rgb(${color.join(",")})`);
}

function _GeneratePoints(sides, radius, rotation = 0) {
  const angle = 360 / sides;
  const vertexIndex = range(sides);

  return parseToCartesian(
    vertexIndex.map((index) => {
      return {
        radius,
        theta: rotation + degreesToRadians(angle * index),
      };
    })
  ).join(" ");

  function parseToCartesian(vertexData) {
    return vertexData.map(({ radius, theta }) => {
      return [radius * Math.cos(theta), radius * Math.sin(theta)];
    });
  }

  function degreesToRadians(degrees) {
    return (Math.PI * degrees) / 180;
  }

  function range(length) {
    return Array.from(Array(length).keys());
  }
}

window.addEventListener("DOMContentLoaded", _Main);

BUTTON_STOP.element.addEventListener("click", function () {
  BUTTON_STOP.state = !BUTTON_STOP.state;

  if (!BUTTON_STOP.state) {
    BUTTON_STOP.element.textContent = "Resume";
    cancelAnimationFrame(requestAnimationFrameId);
  } else {
    BUTTON_STOP.element.textContent = "Stop";
    _Main();
  }
});
