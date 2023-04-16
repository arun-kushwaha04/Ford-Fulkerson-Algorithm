const NODE_SIZE = 20;
const BLACK = '#000000';
const ORANGE = '#ff9900';
const PURPLE = '#ea00ff';
const REFRESH_RATE = 60;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
let isRunning = false;
const intialState = {
 1: [
  {
   label: '5',
   capacity: 10,
   flow: 0,
   color: BLACK,
  },
  {
   label: '4',
   capacity: 2,
   flow: 0,
   color: BLACK,
  },
 ],
 2: [
  {
   label: '5',
   capacity: 4,
   flow: 0,
   color: BLACK,
  },
 ],
 3: [
  {
   label: '5',
   capacity: 7,
   flow: 0,
   color: BLACK,
  },
  {
   label: '4',
   capacity: 8,
   flow: 0,
   color: BLACK,
  },
 ],
 4: [
  {
   label: '7',
   capacity: 5,
   flow: 0,
   color: BLACK,
  },
 ],
 5: [
  {
   label: '6',
   capacity: 2,
   flow: 0,
   color: BLACK,
  },
  {
   label: '8',
   capacity: 9,
   flow: 0,
   color: BLACK,
  },
 ],
 6: [
  {
   label: '9',
   capacity: 8,
   flow: 0,
   color: BLACK,
  },
  {
   label: '10',
   capacity: 4,
   flow: 0,
   color: BLACK,
  },
 ],
 7: [
  {
   label: '9',
   capacity: 10,
   flow: 0,
   color: BLACK,
  },
  {
   label: '10',
   capacity: 2,
   flow: 0,
   color: BLACK,
  },
  {
   label: 't',
   capacity: 6,
   flow: 0,
   color: BLACK,
  },
 ],
 8: [
  {
   label: '10',
   capacity: 3,
   flow: 0,
   color: BLACK,
  },
 ],
 9: [
  {
   label: 't',
   capacity: 10,
   flow: 0,
   color: BLACK,
  },
 ],
 10: [
  {
   label: 't',
   capacity: 8,
   flow: 0,
   color: BLACK,
  },
 ],
 s: [
  {
   label: '1',
   capacity: 9,
   flow: 0,
   color: BLACK,
  },
  {
   label: '2',
   capacity: 6,
   flow: 0,
   color: BLACK,
  },
  {
   label: '3',
   capacity: 10,
   flow: 0,
   color: BLACK,
  },
 ],
};

const position = {
 s: {
  x: 5,
  y: 0,
 },
 1: {
  x: 23,
  y: 45,
 },
 2: {
  x: 23,
  y: 0,
 },
 3: {
  x: 23,
  y: -45,
 },
 4: {
  x: 41,
  y: 25,
 },
 5: {
  x: 41,
  y: -25,
 },
 6: {
  x: 59,
  y: 45,
 },
 7: {
  x: 59,
  y: 0,
 },
 8: {
  x: 59,
  y: -45,
 },
 9: {
  x: 77,
  y: 25,
 },
 10: {
  x: 77,
  y: -25,
 },
 t: {
  x: 95,
  y: 0,
 },
};

let graph = { ...intialState };

//logs container
const logsContainer = document.querySelector('.logs');

//setting canvas width
let canvasParent = document
 .querySelector('.canvas-wrapper')
 .getBoundingClientRect();

const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');

//setting canvas dimensions
canvas.width = canvasParent.width;

//function for plotting the graph
const plotGraph = () => {
 const { height, width } = canvas.getBoundingClientRect();
 ctx.clearRect(0, 0, width, height);

 //drawing edge
 Object.keys(graph).forEach((key) => {
  const pos1 = {
   x: (position[key].x * width) / 100,
   y: (position[key].y * height) / 100 + height / 2,
  };
  graph[key].forEach((node) => {
   const pos2 = {
    x: (position[node.label].x * width) / 100,
    y: (position[node.label].y * height) / 100 + height / 2,
   };
   drawEdge(pos1, pos2, `${node.flow}kV/${node.capacity}kV`, node.color);
  });
 });

 //drawing edges
 Object.keys(position).forEach((key) => {
  drawNodes(
   {
    x: (position[key].x * width) / 100,
    y: (position[key].y * height) / 100 + height / 2,
   },
   key,
  );
 });
};

//function for drawing the nodes
const drawNodes = (pos, nodeNumber) => {
 ctx.beginPath();
 ctx.arc(pos.x, pos.y, NODE_SIZE, 0, 2 * Math.PI);
 ctx.fillStyle = 'burlywood';
 ctx.fill();

 //for writing text
 ctx.font = '24pt Calibri';
 ctx.textAlign = 'center';
 ctx.textBaseline = 'middle';
 ctx.fillStyle = 'black';
 ctx.fillText(nodeNumber, pos.x, pos.y + 3);
 ctx.closePath();
};

//function to draw edge between nodes
const drawEdge = (pos1, pos2, text, color) => {
 let dx = pos2.x - pos1.x;
 let dy = pos2.y - pos1.y;
 let p = pos1;
 let pad = 0.25;
 ctx.beginPath();
 ctx.lineWidth = 2.5;
 ctx.moveTo(pos1.x, pos1.y);
 ctx.lineTo(pos2.x, pos2.y);
 ctx.strokeStyle = color;
 ctx.stroke();

 ctx.save();
 ctx.textAlign = 'center';
 ctx.font = '12pt Calibri';
 ctx.fillStyle = 'black';
 ctx.textBaseline = 'bottom';
 ctx.translate(p.x + dx * pad, p.y + dy * pad);
 ctx.rotate(Math.atan2(dy, dx));
 ctx.fillText(text, 0, 0);
 ctx.restore();
};

setInterval(() => {
 plotGraph();
}, 1 / REFRESH_RATE);

const fordFullkersonDFS = async () => {
 if (isRunning) return;
 isRunning = true;
 graph = { ...intialState };
 while (logsContainer.firstChild) {
  logsContainer.removeChild(logsContainer.lastChild);
 }

 addLog('Logs');
 addLog('Running Ford Fullkerson (DFS) method');
 addLog('-----------------------------------');

 const isVisited = {};
 const path = [];
 let flow = 0;
 let agPath = 0;

 Object.keys(graph).forEach((key) => {
  isVisited[key] = false;
 });

 const runDfs = async (node, bottleNeck) => {
  if (isVisited[node]) return;
  if (node === 't') {
   //found a agumented path

   path.push(node);
   console.log('Checking valid path');
   const res = checkValidPath(path, 0, bottleNeck);
   console.log(path, bottleNeck, res);
   addLog('Found a argumented path');
   addLog(path.join('->'));
   if (!res) {
    addLog('Invalid path reverting back!');
    addLog('-----------------------------------');
    path.pop(node);
    await delay(800);
    return;
   }
   addLog('Updating path');
   await updatePath(path, 0, bottleNeck);
   addLog('-----------------------------------');
   path.pop(node);
   flow += bottleNeck;
   agPath += 1;
   await delay(800);
   return;
  }
  //adding node to the path
  path.push(node);
  isVisited[node] = true;
  //traversing the child node
  for (let i = 0; i < graph[node].length; i++) {
   const childNode = graph[node][i];
   if (childNode.capacity > childNode.flow) {
    const residual = childNode.capacity - childNode.flow;
    await runDfs(childNode.label, Math.min(bottleNeck, residual));
   }
  }
  //popping parent node from path
  path.pop();
  isVisited[node] = false;
  return false;
 };

 const updatePath = async (path, index, bottleNeck) => {
  console.log('Updating path', index);

  if (index >= path.length - 1) return true;
  let parentNode = path[index],
   childNode = path[index + 1];

  for (let i = 0; i < graph[parentNode].length; i++) {
   if (graph[parentNode][i].label === childNode) {
    console.log('child node update');
    graph[parentNode][i].color = ORANGE;
    await delay(500);
    await updatePath(path, index + 1, bottleNeck);
    graph[parentNode][i].flow += bottleNeck;
    addLog(`Increased flow for node ${parentNode} by ${bottleNeck}`);
    await delay(500);
    console.log('child node update 2');
    graph[parentNode][i].color = BLACK;
    return;
   }
  }
  return;
 };

 const checkValidPath = (path, index, bottleNeck) => {
  if (index >= path.length - 1) return true;
  let parentNode = path[index],
   childNode = path[index + 1];

  for (let i = 0; i < graph[parentNode].length; i++) {
   if (graph[parentNode][i].label === childNode) {
    if (graph[parentNode][i].flow + bottleNeck > graph[parentNode][i].capacity)
     return false;
    return checkValidPath(path, index + 1, bottleNeck);
   }
  }
  return false;
 };

 await runDfs('s', 1000);
 addLog('Finished Ford Fullkerson (DFS) method');
 addLog('-----------------------------------');
 addLog(`Max Flow : ${flow}`);
 addLog(`Agumented Path Found: ${agPath}`);
 isRunning = false;
};

const addLog = (message) => {
 const para = document.createElement('p');
 para.innerHTML = message;
 logsContainer.appendChild(para);
 para.scrollIntoView();
};
