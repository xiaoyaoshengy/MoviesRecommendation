var express = require("express");
var path = require("path");
var session = require("express-session");
var csv = require("csvtojson");
var fs = require("fs");
var lunr = require("lunr");
require("lunr-languages/lunr.stemmer.support")(lunr);
require("lunr-languages/lunr.multi")(lunr);
require("lunr-languages/lunr.zh")(lunr);
var child_process = require("child_process");

// express 应用
var app = express();
app.use(
    express.urlencoded({
        extended: false,
    })
);
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: "secret keys",
    })
);
app.use("/assets", express.static(path.resolve(__dirname + "/..")));

// 用户数据
var userData;
csv()
    .fromFile(path.resolve(__dirname + "/../../../database/UserData.csv"))
    .then((json) => {
        userData = json;
    });

// 电影数据
var moviesData;
var returnMovieData;
var idx; // lunr 库解析器
fs.readFile(
    path.resolve(__dirname + "/../../../database/movies_processed.json"),
    (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        moviesData = JSON.parse(data);
        moviesData.sort((a, b) => {
            return b.AVERAGE_RATING - a.AVERAGE_RATING;
        });
        returnMovieData = moviesData;
        idx = lunr(function () {
            this.use(lunr.multiLanguage("en", "zh"));
            this.ref("MOVIE_ID");
            this.field("NAME");
            this.field("GENRES");

            moviesData.forEach((doc) => {
                this.add(doc);
            }, this);
        });
    }
);

// Baseline 算法结果数据
var baselineData;
fs.readFile(
    path.resolve(__dirname + "/../../../database/baseline_results.json"),
    (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        baselineData = JSON.parse(data);
    }
);

// 电影画像数据
var movieProfileData;
fs.readFile(
    path.resolve(__dirname + "/../../../database/movieprofile_results.json"),
    (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        movieProfileData = JSON.parse(data);
    }
);

// 用户画像数据
var userProfileData;
fs.readFile(
    path.resolve(__dirname + "/../../../database/userprofile_results.json"),
    (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        userProfileData = JSON.parse(data);
    }
);

// 用户观影数据
var watchingHistory;
fs.readFile(
    path.resolve(__dirname + "/../../../database/users_history.json"),
    (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        watchingHistory = JSON.parse(data);
    }
);

// 处理请求
app.get("/", (req, res) => {
    res.redirect("/index.html");
});

app.get("/index.html", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../../index.html"));
});

app.get("/login.html", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../../login.html"));
});

app.get("/profile.html", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../../profile.html"));
});

app.get("/movies.html", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../../movies.html"));
});

app.get("/movie-profile.html", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../../movie-profile.html"));
});

app.get("/favourites.html", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../../favourites.html"));
});

app.post("/login", (req, res) => {
    var username = req.body.account;
    var password = req.body.password;
    var hasUser = false;
    for (row in userData) {
        if (userData[row].USER_MD5 == username) {
            hasUser = true;
            if (userData[row].PASSWORD === password) {
                req.session.regenerate(() => {
                    req.session.user = username;
                    res.redirect("/login_success");
                });
            } else {
                res.redirect("/login_failed");
            }
            break;
        }
    }
    if (!hasUser) {
        res.redirect("/login_failed");
    }
});

app.get("/login_failed", (req, res) => {
    res.send("Login failed.");
});

app.get("/login_success", (req, res) => {
    res.send("Login success.");
});

app.get("/restricted", (req, res) => {
    if (req.session.user) {
        res.send("Access success.");
    } else {
        res.send("Access denied.");
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

app.get("/user_info", (req, res) => {
    res.send(req.session.user);
});

var searchedResults;
app.get("/movies", (req, res) => {
    returnMovieData = moviesData;
    if (req.session.searchContent && req.session.searchContent !== "") {
        var results = idx.search(req.session.searchContent);
        var searchedMovieData = [];
        if (results) {
            searchedMovieData = moviesData.filter((value) => {
                return results.some((element) => {
                    return value.MOVIE_ID == element.ref;
                });
            });
        }
        var reg = new RegExp(req.session.searchContent);
        var regResults = moviesData.filter((value) => {
            return reg.test(value.NAME);
        });
        returnMovieData = Array.from(
            new Set([...searchedMovieData, ...regResults])
        );
    }
    searchedResults = returnMovieData;
    res.send(returnMovieData.slice(0, 60));
});

app.post("/sort", (req, res) => {
    if (req.body.sortedBy === "Rating") {
        returnMovieData.sort((a, b) => {
            return b.AVERAGE_RATING - a.AVERAGE_RATING;
        });
    } else if (req.body.sortedBy === "Name") {
        returnMovieData.sort((a, b) => {
            return a.NAME.localeCompare(b.NAME);
        });
    }
    res.send(returnMovieData.slice(0, 60));
});

app.post("/genres", (req, res) => {
    switch (req.body.genres) {
        case "All":
            returnMovieData = searchedResults;
            break;
        case "News":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "News";
                    })
                );
            });
            break;
        case "Biography":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return (
                            element === "传记" || element === "傳記 Biography"
                        );
                    })
                );
            });
            break;
        case "Kids":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "儿童" || element === "兒童 Kids";
                    })
                );
            });
            break;
        case "Adventure":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "冒险";
                    })
                );
            });
            break;
        case "Drama":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "剧情" || element === "劇情 Drama";
                    })
                );
            });
            break;
        case "Action":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "动作" || element === "動作 Action";
                    })
                );
            });
            break;
        case "Animation":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return (
                            element === "动画" || element === "動畫 Animation"
                        );
                    })
                );
            });
            break;
        case "History":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "历史" || element === "歷史 History";
                    })
                );
            });
            break;
        case "Ancient-Costume":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "古装";
                    })
                );
            });
            break;
        case "Same-Sex":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "同性";
                    })
                );
            });
            break;
        case "Comedy":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return (
                            element === "Comedy" ||
                            element === "喜剧" ||
                            element === "喜劇 Comedy"
                        );
                    })
                );
            });
            break;
        case "Fantasy":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "奇幻";
                    })
                );
            });
            break;
        case "Family":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "家庭";
                    })
                );
            });
            break;
        case "Terror":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return (
                            element === "恐怖" ||
                            element === "惊悚" ||
                            element === "惊栗" ||
                            element === "驚悚 Thriller"
                        );
                    })
                );
            });
            break;
        case "Mystery":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return (
                            element === "悬念" ||
                            element === "悬疑" ||
                            element === "懸疑 Mystery"
                        );
                    })
                );
            });
            break;
        case "Adult":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "Audlt" || element === "情色";
                    })
                );
            });
            break;
        case "Romance":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "愛情 Romance" || element === "爱情";
                    })
                );
            });
            break;
        case "Opera":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "戏曲";
                    })
                );
            });
            break;
        case "Warfare":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "战争";
                    })
                );
            });
            break;
        case "Dance":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "歌舞";
                    })
                );
            });
            break;
        case "Kung-Fu":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "武侠";
                    })
                );
            });
            break;
        case "Disaster":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "灾难";
                    })
                );
            });
            break;
        case "Crime":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "犯罪";
                    })
                );
            });
            break;
        case "Reality-TV":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "Reality-TV" || element === "真人秀";
                    })
                );
            });
            break;
        case "Short-Film":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "短片";
                    })
                );
            });
            break;
        case "Science-Fiction":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "科幻";
                    })
                );
            });
            break;
        case "Documentary":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return (
                            element === "紀錄片 Documentary" ||
                            element === "纪录片" ||
                            element === "记录"
                        );
                    })
                );
            });
            break;
        case "Talk-Show":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "Talk-Show" || element === "脱口秀";
                    })
                );
            });
            break;
        case "Theater-Art":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "舞台艺术";
                    })
                );
            });
            break;
        case "Incredible":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "荒诞";
                    })
                );
            });
            break;
        case "Western":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "西部";
                    })
                );
            });
            break;
        case "Sport":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "运动";
                    })
                );
            });
            break;
        case "Music":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "音乐" || element === "音樂 Music";
                    })
                );
            });
            break;
        case "Ghost":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "鬼怪";
                    })
                );
            });
            break;
        case "Black-Movie":
            returnMovieData = searchedResults.filter((value) => {
                return (
                    value.GENRES !== null &&
                    value.GENRES.some((element) => {
                        return element === "黑色电影";
                    })
                );
            });
            break;
    }
    res.send(returnMovieData.slice(0, 60));
});

app.post("/more", (req, res) => {
    res.send(
        returnMovieData.slice(req.body.index * 12, req.body.index * 12 + 60)
    );
});

app.post("/post_search_content", (req, res) => {
    req.session.searchContent = req.body.content;
    res.end();
});

app.get("/get_search_content", (req, res) => {
    res.send(req.session.searchContent);
});

app.post("/post_movie_id", (req, res) => {
    req.session.movieId = req.body.movieId;
    res.end();
});

app.get("/movie_profile", (req, res) => {
    var movieProfile = moviesData.filter((value) => {
        return value.MOVIE_ID == req.session.movieId;
    })[0];
    res.send(movieProfile);
});

app.get("/watching_history", (req, res) => {
    var watchingMovieData;
    if (req.session.user && req.session.user !== "") {
        var watchingData = watchingHistory[req.session.user];
        watchingMovieData = moviesData.filter((value) => {
            return watchingData.MOVIE_ID.some((element) => {
                return element == value.MOVIE_ID;
            });
        });
        for (var i = 0; i < watchingMovieData.length; i++) {
            watchingData.MOVIE_ID.some((value, index) => {
                if (value == watchingMovieData[i].MOVIE_ID) {
                    watchingMovieData[i].RATING = watchingData.RATING[index];
                    return true;
                }
                return false;
            });
        }
    }
    res.send(watchingMovieData);
});

app.post("/recommend", (req, res) => {
    var recommendedMovieData;
    if (req.body.recommendedBy === "Baseline") {
        recommendedMovieData = moviesData.filter((value) => {
            var recommendedMovies = baselineData[req.session.user];
            return recommendedMovies.some((element) => {
                return element == value.MOVIE_ID;
            });
        });
    } else if (req.body.recommendedBy === "UserProfile") {
        recommendedMovieData = moviesData.filter((value) => {
            var recommendedMovies = userProfileData[req.session.user];
            return recommendedMovies.some((element) => {
                return element == value.MOVIE_ID;
            });
        });
    } else if (req.body.recommendedBy === "MovieProfile") {
        recommendedMovieData = moviesData.filter((value) => {
            var recommendedMovies = movieProfileData[req.session.movieId];
            return recommendedMovies.some((element) => {
                return element == value.MOVIE_ID;
            });
        });
    }
    res.send(recommendedMovieData);
});

app.listen(8081);
console.log("Express started on port 8081.");
