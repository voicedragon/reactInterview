import React, { Component } from "react";
import { Iterator } from "./iterator";
import { movies$ } from "./movies";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Data: null,
      Categories: null,
      CatFilter: "",
      Items: 12,
      CurrentPage: 0,
      CurrentIndex: 0,
      flag: false
    };

    this.catFilter = this.catFilter.bind(this);
    this.onChange = this.onChange.bind(this);
    this.modal = this.modal.bind(this);
  }

  componentDidMount() {
    var cat = [];
    //var modal = document.getElementById("modal");

    movies$
      .then(data => {
        let newData = new Iterator(data);

        this.setState(prevState => {
          return {
            Data: newData
          };
        });

        newData.array.forEach(item => {
          cat.push(item.category);
        });
      })
      .then(() => {
        let unique = [...new Set(cat)];
        unique.push("all");
        console.log(unique);
        this.setState(prevState => {
          return {
            Categories: unique
          };
        });
      });
  }

  catFilter(e) {
    if (e.target.id !== null && e.target.id !== "all") {
      let filteredCategory = e.target.id;
      this.setState(prevState => {
        return {
          CatFilter: filteredCategory
        };
      });
    } else if (e.target.id === "all") {
      this.setState(prevState => {
        return {
          CatFilter: ""
        };
      });
    }
  }

  onChange(e) {
    let curr = parseInt(e.target.value);

    this.setState(prevState => {
      return {
        Items: curr
      };
    });
  }

  modal(e) {
    window.scrollTo(0, 0)
    var modal = document.getElementById("modal");
    var id = parseInt(e.target.id);
    console.log(id, "currf");
    this.setState(
      prevState => {
        return {
          CurrentIndex: id
        };
      },
      () => {
        setTimeout(() => {
          modal.style.display === "none"
            ? (modal.style.display = "grid")
            : (modal.style.display = "none");
        }, 100);
      }
    );
  }
  render() {
   /* let testArray = ["one", "two", "three", "four"];
    let testIteration = new Iterator(testArray);*/

    return (
      <div className="App">
        <div id="modal" style={{ display: "none" }}>
          {this.state.Data !== null ? (
            <ul id="modal2">
              {this.state.Data.array
                .slice(
                  this.state.CurrentPage * (this.state.Items - 1),
                  this.state.Items * (this.state.CurrentPage + 1)
                )
                .filter(x => {
                  let reg = new RegExp(this.state.CatFilter);
                  return reg.test(x.category);
                })
                .filter((x, index) => {
                  return index === this.state.CurrentIndex;
                })
                .map((x, index) => {
                  let totalLikes = x.likes + x.dislikes;
                  //console.log(index);
                  let percentageLikes = (x.likes / totalLikes) * 100;
                  let percentageDislikes = (x.dislikes / totalLikes) * 100;
                  return (
                    <div className="modalDiv">
                      <h1
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center"
                        }}
                      >
                        {x.title + " , "}
                        <p
                          style={{
                            fontSize: "16px",
                            fontWeight: "400",
                            marginLeft: "10px"
                          }}
                        >
                          {x.category}
                        </p>
                      </h1>

                      <img alt={x.title} className="modalImage" src={x.title + ".jpg"} />
                      <div
                        id="ratioBar"
                        className="ratioBarModal"
                        style={{
                          minHeight: "50px",
                          display: "flex",
                          flexDirection: "row",
                          width: "400px"
                        }}
                      >
                        <div
                          id={"likes" + x.id}
                          style={{
                            width: percentageLikes + "%",
                            background: "rgb(88, 144, 255)",
                            color: "white"
                          }}
                        >
                          {x.likes}
                        </div>
                        <div
                          id={"dislikes" + x.id}
                          style={{
                            width: percentageDislikes + "%",
                            background: "black",
                            color: "white"
                          }}
                        >
                          {x.dislikes}
                        </div>
                      </div>
                    </div>
                  );
                })}

              <div
                className="buttonsDivModal"
                style={{
                  width: "400px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, 50%)"
                }}
              >
                <button
                  className="modalButtons"
                  onClick={() => {
                    if (this.state.CurrentIndex > 0) {
                      this.setState(prevState => {
                        return {
                          CurrentIndex: prevState.CurrentIndex -= 1
                        };
                      });
                    }
                  }}
                >
                  Previous
                </button>
                <button
                  className="modalButtons"
                  onClick={() => {
                    var cardsClass = document.getElementsByClassName("card");
                    if (this.state.CurrentIndex < cardsClass.length - 1) {
                      this.setState(prevState => {
                        return {
                          CurrentIndex: prevState.CurrentIndex += 1
                        };
                      });
                    }
                  }}
                >
                  Next
                </button>
              </div>
              <button className="modalButtons" onClick={this.modal}>
                Go back
              </button>
            </ul>
          ) : (
            <div />
          )}
        </div>
        <ul id="categories">
          <ul id="categories2">
            {this.state.Categories !== null ? (
              this.state.Categories.map(x => {
                var flag = false;
                //flag for dynamically removing cats
                for (var n = 0; n < this.state.Data.array.length; n++) {
                  if (x === this.state.Data.array[n].category) {
                    flag = true;
                  }
                }
                if (flag === true) {
                  return (
                    <button
                      id={x}
                      onClick={this.catFilter}
                      className="catButton"
                    >
                      {x}
                    </button>
                  );
                }
              })
            ) : (
              <div />
            )}
            <button id="all" onClick={this.catFilter} className="catButton">
              all
            </button>
            <label
              style={{
                width: "100px",
                marginTop: "10px"
              }}
              for="Items/page"
            >
              Items/page
            </label>
            <input
              onChange={this.onChange}
              style={{
                width: "100px"
              }}
              type="range"
              name="Items/page"
              min="4"
              max="12"
              step="4"
            />
          </ul>
        </ul>
        <div id="film">
          {this.state.Data !== null ? (
            this.state.Data.array
              .slice(
                this.state.CurrentPage * (this.state.Items - 1),
                this.state.Items * (this.state.CurrentPage + 1)
              )
              .filter(x => {
                let reg = new RegExp(this.state.CatFilter);
                return reg.test(x.category);
              })
              .map((x, index) => {
                let totalLikes = x.likes + x.dislikes;
                //console.log(index);
                let percentageLikes = (x.likes / totalLikes) * 100;
                let percentageDislikes = (x.dislikes / totalLikes) * 100;

                return (
                  <div className="card" id={"card" + x.id} key={x.id}>
                    <picture>
                      <img
                        alt={x.title}
                        id={index}
                        onClick={this.modal}
                        src={x.title + ".jpg"}
                      />
                    </picture>
                    <div
                      id="ratioBar"
                      style={{
                        minHeight: "20px",
                        display: "flex",
                        flexDirection: "row",
                        width: "100%"
                      }}
                    >
                      <div
                        id={"likes" + x.id}
                        className="likeBars"
                        style={{
                          width: percentageLikes + "%",
                          background: "rgb(88, 144, 255)",
                          color: "white"
                        }}
                      >
                        {x.likes}
                      </div>
                      <div
                        id={"dislikes" + x.id}
                        className="dislikeBars"
                        style={{
                          width: percentageDislikes + "%",
                          background: "black",
                          color: "white"
                        }}
                      >
                        {x.dislikes}
                      </div>
                    </div>
                    <h1>{x.title}</h1>
                    <p className="categoryp">{x.category}</p>

                    <div className="feedbackDiv">
                      <button
                        id={"likeButton" + x.id}
                        style={{
                          background: "white"
                        }}
                        onClick={e => {
                          e.preventDefault();
                          this.setState({ flag: true });
                          var likeButtonId = "likeButton" + x.id;
                          var dislikeButtonId = "dislikeButton" + x.id;
                          var likeButton = document.getElementById(
                            likeButtonId
                          );
                          var dislikeButton = document.getElementById(
                            dislikeButtonId
                          );
                          var thisButton = document.getElementById(e.target.id);

                          if (
                            likeButton.style.background === "white" &&
                            dislikeButton.style.background === "white"
                          ) {
                            x.likes += 1;

                            let likeId = "likes" + x.id;
                            let dislikeId = "dislikes" + x.id;

                            let thisLikeBar = document.getElementById(likeId);
                            let thisDislikeBar = document.getElementById(
                              dislikeId
                            );

                            let totalLikes = x.likes + x.dislikes;
                            let percentageLikes = (x.likes / totalLikes) * 100;
                            let percentageDislikes =
                              (x.dislikes / totalLikes) * 100;

                            thisLikeBar.style.width = percentageLikes + "%";
                            thisDislikeBar.style.width =
                              percentageDislikes + "%";

                            thisLikeBar.textContent = x.likes;
                            thisDislikeBar.textContent = x.dislikes;

                            thisButton.style.background = "rgb(88, 144, 255)";
                            thisButton.style.color = "white";
                          } else if (
                            dislikeButton.style.background === "black"
                          ) {
                            x.likes += 1;
                            x.dislikes -= 1;

                            let likeId = "likes" + x.id;
                            let dislikeId = "dislikes" + x.id;

                            let thisLikeBar = document.getElementById(likeId);
                            let thisDislikeBar = document.getElementById(
                              dislikeId
                            );

                            let totalLikes = x.likes + x.dislikes;
                            let percentageLikes = (x.likes / totalLikes) * 100;
                            let percentageDislikes =
                              (x.dislikes / totalLikes) * 100;

                            thisLikeBar.style.width = percentageLikes + "%";
                            thisDislikeBar.style.width =
                              percentageDislikes + "%";

                            thisLikeBar.textContent = x.likes;
                            thisDislikeBar.textContent = x.dislikes;

                            thisButton.style.background = "rgb(88, 144, 255)";
                            thisButton.style.color = "white";
                            dislikeButton.style.background = "white";
                            dislikeButton.style.color = "black";
                          } /* else if (thisButton.style.background === "rgb(88, 144, 255)") {
                        x.dislikes += 1;
                        x.likes -= 1;

                        let likeId = "likes" + x.id;
                        let dislikeId = "dislikes" + x.id;

                        let thisLikeBar = document.getElementById(likeId);
                        let thisDislikeBar = document.getElementById(dislikeId);

                        let totalLikes = x.likes + x.dislikes;
                        let percentageLikes = (x.likes / totalLikes) * 100;
                        let percentageDislikes =
                          (x.dislikes / totalLikes) * 100;

                        thisLikeBar.style.width = percentageLikes + "%";
                        thisDislikeBar.style.width = percentageDislikes + "%";
                        thisLikeBar.textContent = x.likes;
                        thisDislikeBar.textContent = x.dislikes;
                        thisButton.style.background = "black";
                      }*/
                        }}
                      >
                        Like
                      </button>
                      <button
                        id={"dislikeButton" + x.id}
                        style={{ background: "white" }}
                        onClick={e => {
                          e.preventDefault();
                          this.setState({ flag: true });
                          var likeButtonId = "likeButton" + x.id;
                          var dislikeButtonId = "dislikeButton" + x.id;
                          var likeButton = document.getElementById(
                            likeButtonId
                          );
                          var dislikeButton = document.getElementById(
                            dislikeButtonId
                          );

                          if (
                            likeButton.style.background === "white" &&
                            dislikeButton.style.background === "white"
                          ) {
                            x.dislikes += 1;

                            let likeId = "likes" + x.id;
                            let dislikeId = "dislikes" + x.id;

                            let thisLikeBar = document.getElementById(likeId);
                            let thisDislikeBar = document.getElementById(
                              dislikeId
                            );

                            let totalLikes = x.likes + x.dislikes;
                            let percentageLikes = (x.likes / totalLikes) * 100;
                            let percentageDislikes =
                              (x.dislikes / totalLikes) * 100;

                            thisLikeBar.style.width = percentageLikes + "%";
                            thisDislikeBar.style.width =
                              percentageDislikes + "%";
                            thisLikeBar.textContent = x.likes;
                            thisDislikeBar.textContent = x.dislikes;
                            dislikeButton.style.background = "black";
                            dislikeButton.style.color = "white";
                            likeButton.style.background = "white";
                            likeButton.style.color = "black";
                          } else if (
                            likeButton.style.background === "rgb(88, 144, 255)"
                          ) {
                            x.dislikes += 1;
                            x.likes -= 1;

                            let likeId = "likes" + x.id;
                            let dislikeId = "dislikes" + x.id;

                            let thisLikeBar = document.getElementById(likeId);
                            let thisDislikeBar = document.getElementById(
                              dislikeId
                            );

                            let totalLikes = x.likes + x.dislikes;
                            let percentageLikes = (x.likes / totalLikes) * 100;
                            let percentageDislikes =
                              (x.dislikes / totalLikes) * 100;

                            thisLikeBar.style.width = percentageLikes + "%";
                            thisDislikeBar.style.width =
                              percentageDislikes + "%";
                            thisLikeBar.textContent = x.likes;
                            thisDislikeBar.textContent = x.dislikes;
                            dislikeButton.style.background = "black";
                            dislikeButton.style.color = "white";
                            likeButton.style.background = "white";
                            likeButton.style.color = "black";
                          }
                        }}
                      >
                        Dislike
                      </button>
                    </div>
                    <button
                      style={{
                        background: "white",
                        margin: "1px",
                        width: "100%"
                      }}
                      onClick={e => {
                        e.preventDefault();
                        /*let thisCardId = "card" + x.id;
                        let thisCard = document.getElementById(thisCardId);
                        thisCard.style.display = "none";*/
                        //let currIndex = index;
                        for (let y = 0; y < this.state.Data.array.length; y++) {
                          if (this.state.Data.array[y].title === x.title) {
                            this.setState(prevState => {
                              prevState.Data.array.splice(y, 1);

                              return {
                                Data: prevState.Data
                              };
                            });
                          }
                        }
                      }}
                    >
                      delete
                    </button>
                  </div>
                );
              })
          ) : (
            <div>No Data</div>
          )}
        </div>
        {/*<button
          onClick={e => {
            e.preventDefault();
            testIteration.next();
            console.log(testIteration.hasNext());
            console.log(testIteration.curr());
            let film = document.getElementById("film");
            film.textContent = testIteration.curr();
          }}
        />
        <button
          onClick={e => {
            e.preventDefault();
            testIteration.prev();
            console.log(testIteration.hasNext());
            console.log(testIteration.curr());
            let film = document.getElementById("film");
            film.textContent = testIteration.curr();
          }}*/}
      </div>
    );
  }
}

export default App;