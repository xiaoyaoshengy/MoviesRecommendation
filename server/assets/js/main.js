////////////////////////////////////////////////////////////////
// 全局变量
////////////////////////////////////////////////////////////////

window.globalConfig = {
    baseUrl: "http://39.107.42.36:8081",
};

$(() => {
    /////////////////////////////////////////////////////////////////
    // 检测浏览器宽度
    /////////////////////////////////////////////////////////////////

    $(".js-select").niceSelect();
    $(document).on("click", ".menu-btn", () => {
        $(this).toggleClass("is-active");
        $(".sidebar").toggleClass("is-show");
    });
    const mediaHeader = window.matchMedia("(max-width: 959px)");
    const handleHeader = (e) => {
        if (e.matches) {
            $(".menu-btn").removeClass("is-active");
            $(".sidebar").removeClass("is-show");
            $(document).on("click", ".menu-btn", () => {
                $("body").toggleClass("no-scroll");
            });
        } else {
            $(".menu-btn").addClass("is-active");
            $(".sidebar").addClass("is-show");
            $("body").removeClass("no-scroll");
        }
    };
    mediaHeader.addEventListener("change", handleHeader);
    handleHeader(mediaHeader);

    /////////////////////////////////////////////////////////////////
    // Preloader
    /////////////////////////////////////////////////////////////////

    var $preloader = $("#page-preloader"),
        $spinner = $preloader.find(".spinner-loader");
    $spinner.fadeOut();
    $preloader.delay(250).fadeOut("slow");

    ////////////////////////////////////////////////////////////////
    // Swiper
    ////////////////////////////////////////////////////////////////

    const recommendSlider = new Swiper(".js-recommend .swiper", {
        slidesPerView: 1,
        spaceBetween: 40,
        loop: true,
        watchOverflow: true,
        observeParents: true,
        observeSlideChildren: true,
        observer: true,
        speed: 800,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".js-recommend .swiper-button-next",
            prevEl: ".js-recommend .swiper-button-prev",
        },
        pagination: {
            el: ".js-recommend .swiper-pagination",
            type: "bullets",
            // 'bullets', 'fraction', 'progressbar'
            clickable: true,
        },
    });
    const trendingSlider = new Swiper(".js-trending .swiper", {
        slidesPerView: 1,
        spaceBetween: 40,
        loop: true,
        watchOverflow: true,
        observeParents: true,
        observeSlideChildren: true,
        observer: true,
        speed: 800,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".js-trending .swiper-button-next",
            prevEl: ".js-trending .swiper-button-prev",
        },
        pagination: {
            el: ".js-trending .swiper-pagination",
            type: "bullets",
            // 'bullets', 'fraction', 'progressbar'
            clickable: true,
        },
    });
    const popularSlider = new Swiper(".js-popular .swiper", {
        slidesPerView: 1,
        spaceBetween: 25,
        loop: true,
        watchOverflow: true,
        observeParents: true,
        observeSlideChildren: true,
        observer: true,
        speed: 800,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".js-popular .swiper-button-next",
            prevEl: ".js-popular .swiper-button-prev",
        },
        pagination: {
            el: ".js-popular .swiper-pagination",
            type: "bullets",
            // 'bullets', 'fraction', 'progressbar'
            clickable: true,
        },
        breakpoints: {
            575: {
                slidesPerView: 2,
                spaceBetween: 25,
            },
            1199: {
                slidesPerView: 4,
                spaceBetween: 25,
            },
            1599: {
                slidesPerView: 6,
                spaceBetween: 25,
            },
        },
    });
    const gallerySmall = new Swiper(".js-gallery-small .swiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        watchOverflow: true,
        observeParents: true,
        observeSlideChildren: true,
        observer: true,
        speed: 800,
        pagination: {
            el: ".js-gallery-small .swiper-pagination",
            type: "bullets",
            // 'bullets', 'fraction', 'progressbar'
            clickable: true,
        },
        breakpoints: {
            575: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            767: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
            1599: {
                slidesPerView: 4,
                spaceBetween: 20,
            },
        },
    });
    const galleryBig = new Swiper(".js-gallery-big .swiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        watchOverflow: true,
        autoHeight: true,
        observeParents: true,
        observeSlideChildren: true,
        observer: true,
        speed: 800,
        thumbs: {
            swiper: gallerySmall,
        },
    });

    ////////////////////////////////////////////////////////////////
    // 用户头像下拉菜单
    ////////////////////////////////////////////////////////////////

    $(".page-header__action").mouseover(() => {
        $.get(window.globalConfig.baseUrl + "/restricted", (data) => {
            if (data === "Access success.") {
                $(".page-header__action .menu").toggleClass("active");
            }
        });
    });
    $(".page-header__action").mouseout(() => {
        $.get(window.globalConfig.baseUrl + "/restricted", (data) => {
            if (data === "Access success.") {
                $(".page-header__action .menu").toggleClass("active");
            }
        });
    });

    ////////////////////////////////////////////////////////////////
    // 登录框动画
    ////////////////////////////////////////////////////////////////

    var an = null;
    $("#account").click(() => {
        if (an) an.pause();
        an = anime({
            targets: "path",
            strokeDashoffset: {
                value: 0,
                duration: 700,
                easing: "easeOutQuart",
            },
            strokeDasharray: {
                value: "240 1386",
                duration: 700,
                easing: "easeOutQuart",
            },
        });
    });
    $("#password").click(() => {
        if (an) an.pause();
        an = anime({
            targets: "path",
            strokeDashoffset: {
                value: -336,
                duration: 700,
                easing: "easeOutQuart",
            },
            strokeDasharray: {
                value: "240 1386",
                duration: 700,
                easing: "easeOutQuart",
            },
        });
    });
    $("#submit").mouseover(() => {
        if (an) an.pause();
        an = anime({
            targets: "path",
            strokeDashoffset: {
                value: -730,
                duration: 700,
                easing: "easeOutQuart",
            },
            strokeDasharray: {
                value: "530 1386",
                duration: 700,
                easing: "easeOutQuart",
            },
        });
    });
    $("#account").focus(() => {
        if (an) an.pause();
        an = anime({
            targets: "path",
            strokeDashoffset: {
                value: 0,
                duration: 700,
                easing: "easeOutQuart",
            },
            strokeDasharray: {
                value: "240 1386",
                duration: 700,
                easing: "easeOutQuart",
            },
        });
    });
    $("#password").focus(() => {
        if (an) an.pause();
        an = anime({
            targets: "path",
            strokeDashoffset: {
                value: -336,
                duration: 700,
                easing: "easeOutQuart",
            },
            strokeDasharray: {
                value: "240 1386",
                duration: 700,
                easing: "easeOutQuart",
            },
        });
    });
    $("#submit").focus(() => {
        if (an) an.pause();
        an = anime({
            targets: "path",
            strokeDashoffset: {
                value: -730,
                duration: 700,
                easing: "easeOutQuart",
            },
            strokeDasharray: {
                value: "530 1386",
                duration: 700,
                easing: "easeOutQuart",
            },
        });
    });

    ////////////////////////////////////////////////////////////////
    // 登录相关功能
    ////////////////////////////////////////////////////////////////

    $(".page-header__action .profile").mouseover(() => {
        $.get(window.globalConfig.baseUrl + "/restricted", (data) => {
            if (data === "Access denied.") {
                $(".page-header__action .profile").attr("href", "login.html");
            } else if (data === "Access success.") {
                $(".page-header__action .profile").attr("href", "profile.html");
                $.get(window.globalConfig.baseUrl + "/user_info", (data) => {
                    $(".page-header__action .menu h3").text(data);
                });
            }
        });
    });
    $(".page-content .uk-nav li:eq(2) a").mouseover(() => {
        $.get(window.globalConfig.baseUrl + "/restricted", (data) => {
            if (data === "Access denied.") {
                $(".page-content .uk-nav li:eq(2) a").attr(
                    "href",
                    "login.html"
                );
            } else if (data === "Access success.") {
                $(".page-content .uk-nav li:eq(2) a").attr(
                    "href",
                    "profile.html"
                );
            }
        });
    });
    $(".page-content .uk-nav li:eq(3) a").mouseover(() => {
        $.get(window.globalConfig.baseUrl + "/restricted", (data) => {
            if (data === "Access denied.") {
                $(".page-content .uk-nav li:eq(3) a").attr(
                    "href",
                    "login.html"
                );
            } else if (data === "Access success.") {
                $(".page-content .uk-nav li:eq(3) a").attr(
                    "href",
                    "favourites.html"
                );
            }
        });
    });
    $("#submit").click(() => {
        var username = $("#account").val();
        if (!username) {
            alert("账号为空");
            return;
        }
        var password = $("#password").val();
        if (!password) {
            alert("密码为空");
            return;
        }
        $.post(
            window.globalConfig.baseUrl + "/login",
            {
                account: username,
                password: password,
            },
            (data) => {
                if (data === "Login failed.") {
                    alert("Login failed.");
                } else if (data === "Login success.") {
                    window.location.href =
                        window.globalConfig.baseUrl + "/profile.html";
                }
            }
        );
    });

    ////////////////////////////////////////////////////////////////
    // 搜索相关功能
    ////////////////////////////////////////////////////////////////

    $(".page-header .search__input input").keydown((e) => {
        if (e.which === 13) {
            $.post(window.globalConfig.baseUrl + "/post_search_content", {
                content: $(".page-header .search__input input").val(),
            });
            window.location.href = window.globalConfig.baseUrl + "/movies.html";
        }
    });

    $(".page-main .search__input input").keydown((e) => {
        if (e.which === 13) {
            $.post(window.globalConfig.baseUrl + "/post_search_content", {
                content: $(".page-main .search__input input").val(),
            });
            window.location.href = window.globalConfig.baseUrl + "/movies.html";
        }
    });

    $(".page-main .search__btn button").click(() => {
        $.post(window.globalConfig.baseUrl + "/post_search_content", {
            content: $(".page-main .search__input input").val(),
        });
        window.location.href = window.globalConfig.baseUrl + "/movies.html";
    });

    $(".page-header .search__btn button").click(() => {
        $.post(window.globalConfig.baseUrl + "/post_search_content", {
            content: $(".page-header .search__input input").val(),
        });
        window.location.href = window.globalConfig.baseUrl + "/movies.html";
    });

    ////////////////////////////////////////////////////////////////
    // 搜索框设置内容
    ////////////////////////////////////////////////////////////////

    $.get(window.globalConfig.baseUrl + "/get_search_content", (data) => {
        if (data && data !== "") {
            $(".search__input input").val(data);
        }
    });
});
