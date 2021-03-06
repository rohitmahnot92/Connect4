import PIXI from 'pixi.js';
//variables used in setup
let config;
let renderer;
let rootStage;
//variables used to build the game layout
let caption;
let player;
let texture;
let graphics;
let winner;
let play_again;//button to start new game

let colorCounter=0; // variable that holds the total click count
let yPosition=[5,5,5,5,5,5,5];//array that holds the y coordinates of the grid
const color=[0xCD2626, 0x0000ff];//array containing colors to flip between players
//creating a 6x7 matrix
let myarray=new Array(7);
for (let i=0; i <7; i++)
myarray[i]=new Array(6);

function init(_config){
	//reinitializing variables for new game, and clearing out the matrix
	yPosition=[5,5,5,5,5,5,5];
	myarray=new Array(7);
	for (let i=0; i <7; i++)
	myarray[i]=new Array(6);
	/*accessing the width,height and background color(black) of the grid from config, 
	and feeding it on the game screen.*/
	config = _config;
	renderer= new PIXI.WebGLRenderer(config.resolution.width, config.resolution.height);
	renderer.backgroundColor = config.backgroundColor;
	document.body.innerHTML = '';
	document.body.appendChild( renderer.view );
	//using the pixi library to create discs and other graphics
	rootStage = new PIXI.Container();
	graphics = new PIXI.Graphics();
	play_again = new PIXI.Graphics();
	//calling the build function to build the actual game layout, and then rendering it on the window
	build();
	render();
}//end of setup(_config)

function build() {
	//variable to hold the game title
	caption = new PIXI.Text('Connect 4', { 'font': '20px sans-serif', 'fill': 0xFFFFFF });
	//positioning the caption on the center of the screen
	caption.position.set ( (config.resolution.width - caption.width) / 2, 20);
	//variable to hold whether player plays or wins
	player = new PIXI.Text('Plays', { 'font': '20px sans-serif', 'fill': 0xFFFFFF });
	player.position.set ((config.resolution.width - caption.width) / 2 -170, 20);
	//variable that starts new game upon clicking
	winner = new PIXI.Text('Play Again', { 'font': '20px sans-serif', 'fill': 0x000000 });
	winner.position.set ((config.resolution.width - caption.width) / 2 +170, 20);
	//making the 'Play Again' button clickable
	winner.interactive = true;
	winner.buttonMode = true;
    //adding the above variables to the initial setup
	rootStage.addChild(caption);
	rootStage.addChild(player);
	rootStage.addChild(winner);
	rootStage.addChild(play_again);
	//disc that shows which color starts
	graphics.lineStyle(0);
	graphics.beginFill(color[0], 1.0);
	graphics.drawCircle(70,40,30);
	graphics.endFill();
	//button to restart the game(invisible)
	play_again.lineStyle(0);
	play_again.beginFill(0x000000, 0.1);
	play_again.drawRect((config.resolution.width - caption.width) / 2 +170,20,150,40);
	play_again.endFill();
	play_again.interactive = true;
	play_again.buttonMode = true;
	//calling the init function, to restart the game when you click on 'play again'
	play_again.on('mousedown', () => {
	  init(config);
	});
	let rows=0;//used to decide the number of rows in grid
	const j =0;//used to decide the number of columns in the grid
	//for loop, to make the 6x7 grid for the game.
	for(let i=0; i<8; i++) {
		//condition to check end of row		
		if(i == 7){
			rows++;
			i=0;
		}
		//condition to check end of last column
		if(rows==6)
			break;
		//calculating the position of the circles, based on the game resolution (700x670)
		const x= 50 + 100*i;
		const y= 120+ 100*rows;
		//drawing the empty yellow disc at the calculated position
		graphics.lineStyle(0);
		graphics.beginFill(0xFFFF0B, 0.5);
		graphics.drawCircle(x,y,30);
		graphics.endFill();
	}
	//making the discs clickable, to insert red/blue discs.
	graphics.interactive = true;
	graphics.buttonMode = true;
	//adding the newly created disc to complete the game layout
	rootStage.addChild(graphics);
	//calling onClick function, when clicked on any disc in the 6x7 matrix
    graphics.on('mousedown', onClick);

}//end of build()

function onClick(eventData) {
	//collecting the x coordinate of click  
	// console.log(eventData.data.getLocalPosition(this.parent).x);
	const xData= eventData.data.getLocalPosition(this.parent).x;
	//calucluating the x,y position of the disc on the grid
	const pos=parseInt(xData/100);
	const x= 50 + 100*pos;
	const y= 120+ 100*yPosition[pos];

	if(y>=120){//checking if the y coordinate is valid
		//variables holding x,y coordinates obtained above.
		const a=pos;
		const b=yPosition[pos];
		//logic to determine whether to fill matrix with 0 or 1, based on turn
		if(colorCounter%2==0)
			myarray[a][b]=0;
		else
			myarray[a][b]=1;

		// console.log(myarray[a][b]);
		// console.log(myarray);

		let count=0;//variable to count the number of consecutive connecting discs

		if(colorCounter>=6) {//checking for winner, minimum 7 turns

			/*checking for vertical win, making sure that there is atleast
			 one disc below, looping through the entire column.*/
		  	if(b<5) {
		  		for(var i=b; i<5; i++) {
		  			if(myarray[a][i]==myarray[a][i+1])
		  				count++;//increasing the value of count, if matrix value matches
		  			else
		  				break;
		  		}
		  		//if three connections were made, player wins
		  		if(count>=3) {
		  			// console.log("game over");  
		  			//change color of 'Play Again' from black to white, making it visible
		  			winner.style.fill=0xFFFFFF;
		  			//indicate the game has been won
		  			player.text='Wins!';
		  			graphics.interactive = false;
					graphics.buttonMode = false;
		  		}
		  		else
		  			//reinitialize count to 0, if 3 connections were not made
		  			count=0;
		    }//finish checking for column

		    /*check for 3 connections in the row from current position,going right first
		     and then left */

	    	for(var i=a;i<6;i++) { //looping to the right
	    		if(myarray[i][b]==myarray[i+1][b])
	    			count++;
	    		else
	    			break;
	    	}
	    	for(var i=a;i>0;i--){//looping to the left
	    		if(myarray[i][b]==myarray[i-1][b])
	    			count++;
	    		else
	    			break;
	    	}
	    	//checking total number of connections(left side+ right side), to determine whether game is over
	    	if(count>=3) {
	    		// console.log("game over");  
	  			//change color of 'Play Again' from black to white, making it visible
	  			winner.style.fill=0xFFFFFF;
	  			//indicate the game has been won
	  			player.text='Wins!';
	  			//deactivate the clicks once game is over. Only 'Play Again' button works.	  			
	  			graphics.interactive = false;
				graphics.buttonMode = false;	  			
	    	}
	    	else
	    		count=0;
	    	//finish checking for rows

	    	//check for first diagonal
		    let num=1;//loop vriable to navigate through diagonals
		    while(a+num<=6 && b+num<=5) {//checking for end of diagonal
		    	if (myarray[a][b]==myarray[a+num][b+num]) {
		    		//increment count if matrix values match
		    		count++;
		    		//increment num(loop variable)
		    		num++;
		    	}
		    	else 
		    		break;
		    }
		    num=1;//reinitialize loop variable to check other side of same diagonal
		    while(a-num>=0 && b-num>=0) {//checking for other end of same diagonal
		    	if(myarray[a][b]==myarray[a-num][b-num]){
		    		//increment count if values match
		    		count++;
		    		//increment loop variable
		    		num++;
		    	}
		    	else
		    		break;
		    }
		    /*checking total number of connections(left side +right side), 
		    to determine whether game is over*/
		    if(count>=3) {
		    	// console.log("game over");  
	  			//change color of 'Play Again' from black to white, making it visible
	  			winner.style.fill=0xFFFFFF;
	  			//indicate the game has been won
	  			player.text='Wins!';
	  			//deactivate the clicks once game is over. Only 'Play Again' button works.
	  			graphics.interactive = false;
				graphics.buttonMode = false;	  			
		    } 
		    //if game is not over, reinitialize count to 0, and num to 1, for next diagonal
		    else {
		    	count=0;
		    	num=1;
		    }
			//checked for diagonal 1

			//repeat what you do for the first diagonal, and check for winner.
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
				// console.log("game over");
				winner.style.fill=0xFFFFFF;
				player.text='Wins!';
			    //deactivate the clicks once game is over. Only 'Play Again' button works.
	  			graphics.interactive = false;
				graphics.buttonMode = false;					
			} 
			else {
				count=0;
				num=1;
			}
			//checked for diagonal 2
	
		}//finished checking for all possibilities for winner

		//draw disc for current player  		
		graphics.lineStyle(0);
		graphics.beginFill(color[colorCounter%2], 1.0);
		graphics.drawCircle(x,y,30);
		graphics.endFill();

		colorCounter++;//increment the colorCounter for next click
	    yPosition[pos] -=1;//decrement the value of y for the current row

	    	//check for a tie, if all turns have been played, and no winner has emerged
			if(player.text=='Plays' && colorCounter==42) {
			  	winner.style.fill=0xFFFFFF;
			  	player.text='Draw!';
			  }
			/*if all turns have not been played, and no winner has emerged, 
			change the color of the disc for next turn. Note that we have already
			incremented the value of colorCounter, so the color of disc changes*/
			if(player.text=='Plays') {
			  	graphics.lineStyle(0);
			  	graphics.beginFill(color[(colorCounter)%2], 1.0);
			  	graphics.drawCircle(70,40,30);
			  	graphics.endFill();
			  }
	    //if winner has emerged, then get out of the function.
	    else
	    return;
	}
}//close onClick

//function to render thee game setup
function render() {
	renderer.render(rootStage);
	requestAnimationFrame(render);
}
//exporting init function to 
export default {
	init : init
}