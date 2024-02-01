import {useState} from "react";

function Square({value,onSquareClick,className}){

  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({xIsNext,squares,onPlay,currentMove}) {

  function handleClick(i){
    if(squares[i]||calculateWinner(squares)){
      return;
    }
    const nextSquares=squares.slice();
    if(xIsNext){
      nextSquares[i]="X";
    }else{
      nextSquares[i]="O";
    }
    const position={row:Math.floor(i/3)+1,col:(i%3)+1};
    onPlay(nextSquares,position);
  }
  const winner=calculateWinner(squares);
  let status;
  let winningLine=null;
  let statusClassName="status"
  if(winner){
    status="Winner: "+winner;
    statusClassName+=" yellowback";
    winningLine=calculateWinnerLine(squares);
  }else if(currentMove===9){
    status="Draw";
    statusClassName+=" grayback";
  }else{
    status="Next player: "+(xIsNext ?"X":"O");
  }
  //ここでループを使うことでハイライトの処理をまとめられた。
  return (
    <>
      <div className={statusClassName}>{status}</div>
      {
      (()=>{
        const rows=[];
        for(let i=0;i<3;i++){
          const row=[];
          for (let j=0;j<3;j++){
            const index=i*3+j;
            let highlight=false;
            let className="square";
            if(winner){
              for(const square of winningLine){
                if(square===index){
                  highlight=true;
                  className+=" highlight";
                  break;
                }
              }
            }
            row.push(
              <Square
              key={index}
              value={squares[index]}
              onSquareClick={()=>handleClick(index)}
              className={className}
              />
            );
          }
          rows.push(<div key={i} className="board-row">{row}</div>);
        }
        return rows;
      })()}
    </>
  );
}

function calculateWinnerLine(squares){//勝ったときのマスを計算し、マス目の配列を返す。calculateWinnerとまとめたほうが短くなりそう。
  const lines=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];
  for (let i=0;i<lines.length;i++){
    const[a,b,c]=lines[i];
    if(squares[a]&&squares[a]===squares[b]&&squares[a]===squares[c]){
      return [a,b,c];
    }
  }
  return null;
}

function calculateWinner(squares){
  const lines=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];
  for (let i=0;i<lines.length;i++){
    const[a,b,c]=lines[i];
    if(squares[a]&&squares[a]===squares[b]&&squares[a]===squares[c]){
      return squares[a];
    }
  }
  return null;

}

export default function Game(){
  const [history,setHistory]=useState([{squares:Array(9).fill(null),position:null}]);//positionの追加
  const [currentMove,setCurrentMove]=useState(0);
  const [isAscending,setIsAscending]=useState(false);
  const xIsNext= (currentMove%2===0);
  const currentSquares=history[currentMove].squares;
  function handlePlay(nextSquares,position){    //handlePlayにpositionを渡しBoardでpositionを計算しここで更新。
    const nextHistory=[...history.slice(0,currentMove+1),{squares:nextSquares,position:position}];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length-1);
  }
  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }

  const moves=history.map((hist,move)=>{
    let description;
    const position=hist.position?` (${hist.position.row},${hist.position.col})`:"";    //positionの出力形式
    if(move>0){
      description="Go to move #"+move;
    }else{
      description="Go to game start";
    }
    return(
      <li key={move}>
        <button onClick={()=>jumpTo(move)}>{description}{position}</button>
      </li>
    );
  });


  const buttonText=isAscending?"sort ascending":"sort descending";
  //BoardのcurrentMoveは引き分けの判定のために使う。
  return(
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove}/>
        <div className="message">You are at move#{currentMove} {history[currentMove].position? `(${history[currentMove].position.row},${history[currentMove].position.col})`:""}</div>
        <button className="reset" onClick={()=>{
            setHistory([{squares:Array(9).fill(null),position:null}]);//positionの追加
            setCurrentMove(0);
            setIsAscending(false);
        }}>
          reset
        </button>
      </div>
      <div className="game-info">
        <button onClick={()=>{setIsAscending(!isAscending);}}>{buttonText}</button>
        <ul>{isAscending? moves.reverse():moves}</ul>
      </div>
    </div>

  )
}

