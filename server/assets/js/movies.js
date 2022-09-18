$(() => {
    $(".page-main").children("div.uk-grid").empty();

    // 加载电影数据
    var LoadMovies = (data) => {
        for (var i = 0; i < 10 && i < Math.ceil(data.length / 12); i++) {
            for (var j = 0; j < 12 && i * 12 + j < data.length; j++) {
                var movieId = data[i * 12 + j].MOVIE_ID;
                var movieName = data[i * 12 + j].NAME;
                var movieGenres = data[i * 12 + j].GENRES;
                var movieRating = data[i * 12 + j].AVERAGE_RATING;
                var movieCover =
                    data[i * 12 + j].R === null
                        ? "/assets/img/no-cover.jpg"
                        : data[i * 12 + j].R;
                $(".page-main")
                    .children("div.uk-grid")
                    .append(
                        '<div class="movies">' +
                            '<div class="game-card">' +
                            '<div class="game-card__box">' +
                            '<div class="game-card__media">' +
                            '<a href="javascript:void(0);" movie_id="' +
                            movieId +
                            '" onclick="postMovieId(this)">' +
                            '<img src="' +
                            movieCover +
                            '" alt="' +
                            movieName +
                            '" />' +
                            "</a>" +
                            "</div>" +
                            '<div class="game-card__info">' +
                            '<a class="game-card__title" href="javascript:void(0);" movie_id="' +
                            movieId +
                            '" onclick="postMovieId(this)">' +
                            movieName +
                            "</a>" +
                            '<div class="game-card__genre">' +
                            (movieGenres === null
                                ? ""
                                : movieGenres.join(" / ")) +
                            "</div>" +
                            '<div class="game-card__rating-and-price">' +
                            '<div class="game-card__rating">' +
                            "<span>" +
                            (movieRating === null
                                ? "-.-"
                                : Math.round(movieRating * 10) / 10) +
                            "</span>" +
                            '<ion-icon name="star" class="star"></ion-icon>' +
                            "</div>" +
                            "</div>" +
                            "</div>" +
                            "</div>" +
                            "</div>" +
                            "</div>"
                    );
            }
        }
    };

    // movies.html 电影数据
    var index = 0;
    $.get(window.globalConfig.baseUrl + "/movies", (data) => {
        index = 0;
        LoadMovies(data);
    });

    // 电影数据排序功能
    $("select.js-select.sort").change(() => {
        index = 0;
        $.post(
            window.globalConfig.baseUrl + "/sort",
            {
                sortedBy: $("select.js-select.sort option:selected").val(),
            },
            (data) => {
                $(".page-main").children("div.uk-grid").empty();
                LoadMovies(data);
            }
        );
    });

    // 电影数据分类功能
    $("select.js-select.genres").change(() => {
        index = 0;
        $.post(
            window.globalConfig.baseUrl + "/genres",
            {
                genres: $("select.js-select.genres option:selected").val(),
            },
            (data) => {
                $(".page-main").children("div.uk-grid").empty();
                LoadMovies(data);
            }
        );
    });

    // 下拉加载数据
    $(".page-main").scroll(() => {
        var scrollTop = $(".page-main").scrollTop();
        var clientHeight = $(".page-main")[0].clientHeight;
        var scrollHeight = $(".page-main")[0].scrollHeight;
        if (scrollTop + clientHeight >= scrollHeight) {
            index += 5;
            $.post(
                window.globalConfig.baseUrl + "/more",
                {
                    index: index,
                },
                (data) => {
                    LoadMovies(data);
                }
            );
        }
    });
});
