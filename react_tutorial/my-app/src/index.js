import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
            style={props.style}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        const isBingo = !!(this.props.bingo.find((e) => e == i));
        const style = isBingo ? {
            backgroundColor: "red",
            color: "white",
        } : {};

        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            style={style}
        />;
    }

    render() {
        const zeroToThree = [...Array(3).keys()]

        const squareBoxes = zeroToThree.map((i) => {
            const squareRow = zeroToThree.map((j) => {
                return (
                    this.renderSquare(i * 3 + j)
                )
            })

            return (
                <div className={"board-row"}>
                    {squareRow}
                </div>
            )
        });

        return (
            <div>
                { squareBoxes }
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                spot: [null, null],
            }],
            stepNumber: 0,
            historyListIsAsc: true,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) { return }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                spot: [parseInt(i / 3), i % 3],
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    toggle() {
        this.setState({
            historyListIsAsc: !this.state.historyListIsAsc,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const currentResult = calculateWinner(current.squares);
        const winner = currentResult ? currentResult.winner : null;
        const bingo = currentResult ? currentResult.bingo : [null, null, null];

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + ' ' + history[move].spot :
                'Go to game start';

            const currentStyle = {
                fontWeight: "bold",
            }
            const isCurrentMove = move == this.state.stepNumber

            return (
                <li key={move}>
                    <button
                        onClick={() => this.jumpTo(move)}
                        style={isCurrentMove ? currentStyle : undefined}
                    >{desc}</button>
                </li>
            );
        });

        const toggleSwitch = (
            this.state.historyListIsAsc ?
                <button>Asc</button> :
                <button>Desc</button>
        );

        let status;
        if (winner) {
            status = 'Winner' + winner;
        } else if (current.squares.find(e => e === null) === undefined) {
            status = 'Draw';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        };

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        bingo={bingo}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div onClick={() => this.toggle()}>{toggleSwitch}</div>
                    {this.state.historyListIsAsc && <ol>{moves}</ol>}
                    {!this.state.historyListIsAsc && <ol>{moves.reverse()}</ol>}
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4 ,7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
            return {
                winner: squares[a],
                bingo: lines[i],
            };
        }
    }
    return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
