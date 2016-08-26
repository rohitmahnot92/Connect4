import PIXI from 'pixi.js';

var config;
	var renderer;
	var rootStage;
	var caption;
	var player;
	var texture;
	var graphics;
	var winner;
	var play_again;
	var colorCounter=0; // variable that holds the total click count
	
	var yPosition=[5,5,5,5,5,5,5];//array that holds the y coordinates of the grid
	var color=[0xCD2626, 0x0000ff];//colors blue and red
//creating a 6x7 matrix
	var myarray=new Array(7);
    for (var i=0; i <7; i++)
  myarray[i]=new Array(6);

	function init(_config){
	  
    yPosition=[5,5,5,5,5,5,5];
    myarray=new Array(7);
    for (var i=0; i <7; i++)
    myarray[i]=new Array(6);
    
    config = _config;
		renderer= new PIXI.WebGLRenderer(config.resolution.width, config.resolution.height);
		renderer.backgroundColor = config.backgroundColor;
    document.body.innerHTML = '';
		document.body.appendChild( renderer.view );

		rootStage = new PIXI.Container();
		graphics = new PIXI.Graphics();
		play_again = new PIXI.Graphics();

		build();
		render();
	}//end of setup(_config)

	function build() {
		caption = new PIXI.Text('Connect 4', { 'font': '20px sans-serif', 'fill': 0xFFFFFF });
		caption.position.set ( (config.resolution.width - caption.width) / 2, 20);
		player = new PIXI.Text('Plays', { 'font': '20px sans-serif', 'fill': 0xFFFFFF });
		player.position.set ((config.resolution.width - caption.width) / 2 -170, 20);
		winner = new PIXI.Text('Play Again', { 'font': '20px sans-serif', 'fill': 0x000000 });
		winner.position.set ((config.resolution.width - caption.width) / 2 +170, 20);
		winner.interactive = true;
		winner.buttonMode = true;

		rootStage.addChild(caption);
		rootStage.addChild(player);
		rootStage.addChild(winner);
		rootStage.addChild(play_again);

		graphics.lineStyle(0);
		graphics.beginFill(color[0], 1.0);
		graphics.drawCircle(70,40,30);
		graphics.endFill();
		
		play_again.lineStyle(0);
		play_again.beginFill(0x000000, 0.1);
		play_again.drawRect((config.resolution.width - caption.width) / 2 +170,20,150,40);
		play_again.endFill();
		play_again.interactive = true;
		play_again.buttonMode = true;
		
		play_again.on('mousedown', function() {
		  init(config);
		});

		var rows=0;//used to decide the number of rows in grid
		var j =0;//used to decide the number of columns in the grid
//for loop, to make the 6x7 grid for the game.
		for(var i=0; i<8; i++){
//condition to check end of row		
			if(i == 7){
				rows++;
				i=0;
			}
//condition to check end of last column
			if(rows==6)
				break;
//calculating the position of the circles, based on the game resolution (700x670)
			var x= 50 + 100*i;
			var y= 120+ 100*rows;

			graphics.lineStyle(0);
			graphics.beginFill(0xFFFF0B, 0.5);
			graphics.drawCircle(x,y,30);
			graphics.endFill();
		}
		graphics.interactive = true;
		graphics.buttonMode = true;
	  rootStage.addChild(graphics);
	  graphics.on('mousedown', onClick);

	}//end of build()
	
	function onClick(eventData) {
//collecting the x coordinate of click	  
	  console.log(eventData.data.getLocalPosition(this.parent).x);
	  var xData= eventData.data.getLocalPosition(this.parent).x;
//calucluating the position of the disc
	  var pos=parseInt(xData/100);
	  var x= 50 + 100*pos;
		var y= 120+ 100*yPosition[pos];

    if(y>=120){//checking if the y cordinate is valid
      var a=pos;
      var b=yPosition[pos];
    
      if(colorCounter%2==0)
        myarray[a][b]=0;
      else
        myarray[a][b]=1;
        
      console.log(myarray[a][b]);
      console.log(myarray);
        
      var count=0;//variable to count the number of consececutive connecting discs

      if(colorCounter>=6) {//checking for winner, minimum 7 turns
        if(b<5) {
          for(var i=b; i<5; i++) {
            if(myarray[a][i]==myarray[a][i+1])
              count++;
            else
              break;
          }
          if(count>=3) {
            console.log("game over");  
            winner.style.fill=0xFFFFFF;
            player.text='Wins!';
          }
          else
          count=0;
        }//check for bottom 
       if(0<a && a<6) {
          for(var i=a;i<6;i++) {
            if(myarray[i][b]==myarray[i+1][b])
            count++;
            else
            break;
          }
          for(var i=a;i>0;i--){
            if(myarray[i][b]==myarray[i-1][b])
            count++;
            else
            break;
          }
          if(count>=3) {
              console.log("game over");  
              winner.style.fill=0xFFFFFF;
              player.text='Wins!';
          }
          else
          count=0;
        }//checked for side
        
        var num=1;//loop vriable for diagnols
        while(a+num<=6 && b+num<=5) {
          if (myarray[a][b]==myarray[a+num][b+num]) {
            count++;
            num++;
          }
          else 
          break;
        }
        num=1;//reinitialize num for next loop
        while(a-num>=0 && b-num>=0) {
          if(myarray[a][b]==myarray[a-num][b-num]){
            count++;
            num++;
          }
          else
          break;
        }
          
        if(count>=3) {
          console.log("game over");  
          winner.style.fill=0xFFFFFF;
          player.text='Wins!';
        } 
        else {
          count=0;
          num=1;
        }
//checked for diagnol 1
        while(a+num<=6 && b-num>=0) {
          if (myarray[a][b]==myarray[a+num][b-num]) {
            count++;
            num++;
          }
          else
          break;
        }
        num=1;
        while(a-num>=0 && b+num<=5) {
          if (myarray[a][b]==myarray[a-num][b+num]) {
            count++;
            num++;
          }
          else
          break;
        }
        if(count>=3) {
        console.log("game over");
        winner.style.fill=0xFFFFFF;
        player.text='Wins!';
        } 
        else {
          count=0;
          num=1;
        }
//checked for diagnol 2
      }
//toggle color for next player's turn      
//draw disc for current player  		
      graphics.lineStyle(0);
  		graphics.beginFill(color[colorCounter%2], 1.0);
  		graphics.drawCircle(x,y,30);
  		graphics.endFill();
  		colorCounter++;//increment the colorCounter for next click
  	  yPosition[pos] -=1;//decrement the value of y for the current row
  	  if(player.text=='Plays' && colorCounter==42)
  	  {
  	    winner.style.fill=0xFFFFFF;
        player.text='Draw!';
  	  }
      if(player.text=='Plays') {
        graphics.lineStyle(0);
    		graphics.beginFill(color[(colorCounter)%2], 1.0);
    		graphics.drawCircle(70,40,30);
    		graphics.endFill();
      }
      else
      return;
    }
	}//close onClick

	function render() {
		renderer.render(rootStage);
		requestAnimationFrame(render);
	}

export default {
	init : init
}