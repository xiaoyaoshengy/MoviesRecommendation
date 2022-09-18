$(() => {
    // 获取用户名
    $.get(window.globalConfig.baseUrl + "/user_info", (data) => {
        if (data) {
            $(".page-main .widjet.--profile .user-info__title").text(data);
        }
    });

    // 获取用户观影历史
    var watchingData;
    $.get(window.globalConfig.baseUrl + "/watching_history", (data) => {
        $(".page-main .widjet.--activity .uk-grid").empty();
        for (var i = 0; i < data.length; i++) {
            var movieId = data[i].MOVIE_ID;
            var movieName = data[i].NAME;
            var movieGenres =
                data[i].GENRES == null ? "" : data[i].GENRES.join(" / ");
            var movieRating = data[i].RATING;
            var movieCover =
                data[i].R == null ? "assets/img/no-cover.jpg" : data[i].R;
            $(".page-main .widjet.--activity .uk-grid").append(
                '<div class="movies">' +
                    '<div class="game-card__box">' +
                    '<div class="game-card__media">' +
                    '<a href="javascript:void(0);" movie_id="' +
                    movieId +
                    '" onclick="postMovieId(this)">' +
                    '<img src="' +
                    movieCover +
                    '" alt="' +
                    movieName +
                    '">' +
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
    });
});
