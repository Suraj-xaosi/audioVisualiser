 let input= document.getElementById("audio");


input.addEventListener("change",(event)=>{
  const file=event.target.files[0];   // this is audiofile 
  const reader= new FileReader();     //this is reader and it will read the file . then we have to pull out the audio in audioBuffer form
  reader.addEventListener("load",(e)=>{
    const arrayBuffer=e.target.result;
    const audioContext=new (window.AudioContext||window.webkitAudioContext)();   
    audioContext.decodeAudioData(arrayBuffer,(audioBuffer)=>{
      
      visualize(audioBuffer,audioContext);
    })
  })
  reader.readAsArrayBuffer(file);
})
function visualize(audioBuffer, audioContext){
  
  const canvas =document.getElementById("canvas");
  
  canvas.requestFullscreen();
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  
  const anylyser= audioContext.createAnalyser();
  anylyser.fftSize=256;
  const frequencyBufferLength=anylyser.frequencyBinCount;
  const frequnecyData=new Uint8Array( frequencyBufferLength);
  
  anylyser.connect(audioContext.destination);

 
  const source= audioContext.createBufferSource();
  source.buffer=audioBuffer;
  source.connect(anylyser);
  source.start();
  
  const canvasContext=canvas.getContext("2d");
  
  const barWidth=canvas.width/frequencyBufferLength;
  
  
  function draw(){

    requestAnimationFrame(draw);
    anylyser.getByteFrequencyData(frequnecyData);
    console.log(frequnecyData);
    canvasContext.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    canvasContext.fillStyle = "blue"
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    //canvasContext.fillText('Hello, Canvas!', canvas.width / 2, canvas.height / 2);



    for(let i=0;i<frequencyBufferLength;i++){
      
      canvasContext.fillStyle = "rgba(255,255,0," + (frequnecyData[i]) + ")";
      canvasContext.fillRect(
        i*barWidth,
        canvas.height-frequnecyData[i]*1.5,
        barWidth-1,
        frequnecyData[i]*2
      );
    }
  };
 
  //input.remove();
  draw();
  
}