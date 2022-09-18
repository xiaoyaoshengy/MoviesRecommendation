$(() => {
    $(".page-main").children("div.uk-grid").empty();

    // 加载数据
    var LoadMovies = (data) => {
        for (var i = 0; i < 12 && i < data.length; i++) {
            var movieId = data[i].MOVIE_ID;
            var movieName = data[i].NAME;
            var movieGenres =
                data[i].GENRES === null ? "" : data[i].GENRES.join(" / ");
            var movieRating =
                data[i].AVERAGE_RATING === null
                    ? "-.-"
                    : Math.round(data[i].AVERAGE_RATING * 10) / 10;
            var movieCover =
                data[i].R === null ? "assets/img/no-cover.jpg" : data[i].R;
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
                        movieGenres +
                        "</div>" +
                        '<div class="game-card__rating-and-price">' +
                        '<div class="game-card__rating">' +
                        "<span>" +
                        movieRating +
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
    };

    // 推荐
    $.post(
        window.globalConfig.baseUrl + "/recommend",
        {
            recommendedBy: $("select.js-select.sort option:selected").val(),
        },
        (data) => {
            LoadMovies(data);
        }
    );

    // 推荐算法更换
    $("select.js-select.sort").change(() => {
        $.post(
            window.globalConfig.baseUrl + "/recommend",
            {
                recommendedBy: $("select.js-select.sort option:selected").val(),
            },
            (data) => {
                $(".page-main").children("div.uk-grid").empty();
                LoadMovies(data);
            }
        );
    });
});
