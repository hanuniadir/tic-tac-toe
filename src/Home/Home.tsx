import "./Home.css";
import React from "react";
import { flatten, splitEvery } from "ramda";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import axios from "axios";

function Square(props: any) {
  return (
    <button
      className={props.class}
      id={props.id}
      onClick={props.onClick}
      disabled={props.disabled}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}>
      {props.value}
    </button>
  );
}

export default class Home extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      winner: "",
      board: Array(9).fill(""),
      backColor: Array(9).fill("")
    }
  }

  handleUserStep = async (i: number) => {
    if (!this.state.loading && !this.state.winner && this.state.board[i] === "") {
      const newBoard = this.state.board
      newBoard[i] = "X";
      this.setState({ board: newBoard })
      await this.checkWinner();
      if (!this.state.winner) {
        this.setState({ loading: true })
        await this.getAIBoard(this.state.board).then(board => {
          this.setState({ board, loading: false })
        })
      }
      await this.checkWinner();
    }
  }

  getAIBoard = async (board: string[]) => {
    const aiBoard = await axios.post("https://d9u7x85vp9.execute-api.us-east-2.amazonaws.com/production/engine",
      { board: splitEvery(3, board) },
      { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } })
      .then((data: any) => {
        return flatten(data.data.board)
      })
      .catch((err) => {
        if (err.response.status === 500)
          this.props.updateSession()
        return board
      });
    return aiBoard
  }

  checkWinner = () => {
    const winningsOpts = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < winningsOpts.length; i++) {
      const [a, b, c] = winningsOpts[i];
      if (this.state.board[a] && this.state.board[a] === this.state.board[b] && this.state.board[a] === this.state.board[c]) {
        this.setState({ winner: `The Winner is: ${this.state.board[a]}` });
        const winnerLine = Array(9).fill("")
        winnerLine[a] = "winner"
        winnerLine[b] = "winner"
        winnerLine[c] = "winner"
        this.setState({ backColor: winnerLine })
      } else if (this.state.board.indexOf("") === -1) {
        this.setState({ winner: `X/O => Draw` });
      }
    }
  }

  helpMe = () => {
    // const oppositeBoard = this.state.board.map((a: any) => {
    //   switch (a) {
    //     case "X":
    //       return "O"
    //     case "O":
    //       return "X"
    //     default:
    //       return ""
    //   }
    // })
    // this.getAIBoard(oppositeBoard).then(aiBoard => this.markDiff(oppositeBoard, aiBoard))

    this.markDiff(["X", "", "", "", "", "", "", "", ""], ["X", "", "O", "", "", "", "", "", ""]) // MarkDiff Check
  }

  markDiff = (board1: string[], board2: string[]) => {
    const helpArray = Array(9).fill("")
    board1.map((value, index) => {
      if (board1[index] !== board2[index])
        helpArray[index] = "winner"
    })
    this.setState({ backColor: helpArray })
  }

  resetBoard = () => {
    this.setState({
      winner: "",
      board: Array(9).fill(""),
      backColor: Array(9).fill("")
    })
  }

  MouseEnter = (event: any) => {
    const id = event.target.id;
    this.setState({
      backColor: this.state.backColor.map((a: any, inx: any) => {
        if ((inx % 3 === id % 3)
          || (inx % 3 < id % 3 && id - inx <= 2 && id - inx > 0)
          || (inx % 3 > id % 3 && inx - id <= 2 && inx - id > 0))
          return "hov"
        return ""
      })
    })
  }

  MouseLeave = (event: any) => {
    this.setState({ backColor: Array(9).fill("") })
  }

  renderSquare = (i: number) => {
    return <Square id={i}
      value={this.state.board[i]}
      class={"square " + this.state.backColor[i]}
      onClick={() => this.handleUserStep(i)}
      disabled={this.state.winner || this.state.loading}
      onMouseEnter={this.MouseEnter}
      onMouseLeave={this.MouseLeave} />;
  }

  render() {
    return (
      <div className="board" >
        {this.state.loading ? <CircularProgress className="loading" /> : null}
        <div className="actions">
          <Button
            onClick={() => this.resetBoard()}
            size="small"
            color="primary"
          >
            Reset
          </Button>
          <Button
            onClick={() => this.helpMe()}
            size="small"
            color="primary"
          >
            Help Me!
          </Button>
        </div>
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
        <div className="winner-status"><h1>{this.state.winner}</h1></div>
      </div >
    );
  }
}