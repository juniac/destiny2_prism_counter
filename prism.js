$(function() {

  var colors = {
    solar: {
      primary: 'bg-orange-700',
      secondary: 'bg-orange-400'
    },
    void: {
      primary: 'bg-purple-600',
      secondary: 'bg-purple-400'
    },
    arc: {
      primary: 'bg-blue-600',
      secondary: 'bg-blue-400'
    },
    stop: {
      primary: 'bg-grey-500',
      secondary: 'bg-grey-300'
    }
  };

  var currentDamageTypeTitle = $("#damage_type_title");
  var currentDamageTypeTitleWrapper = $("#damage_type_title_bg");
  var timeRemaning = $("#time_remaining");
  var percentage = $("#percentage");
  var timeRemaningBackground = $("#time_remaining_background");
  var nextUpcoming = $("#next");

  var damageTypeButtons = $('#damage_type_button_wrapper').children();




  var remain = parseInt($('#timevalue').val());
  var currentDamageTypeIndex = 1;
  var timer = null;
  var interval = 1000;
  var timePassed = 0;
  var loopInterval = parseInt($('#timevalue').val());

  var button = {
    solar: $("#solar"),
    arc: $("#arc"),
    voi: $("#void"),
    stop: $("#stop")
  };

  var init = function() {
    button.solar.on('click', start);
    button.voi.on('click', start);
    button.arc.on('click', start);
    button.stop.on('click', stop);
  }



  var start = function() {

    var selectedDamageTypeIndex = damageTypeButtons.index($(this));

    clearTimeout(timer);
    currentDamageTypeIndex = selectedDamageTypeIndex;
    timePassed = 1000;
    loopInterval = parseInt($('#timevalue').val()) * 1000;
    remain = loopInterval - timePassed;
    changeState(selectedDamageTypeIndex);
    if (timer != null) {
      timer.stop();
      timer = null;
    }
    loop();
    timer = new adjustingInterval(loop, interval, function() {});
    timer.start();
  };

  var stop = function() {
    //clearTimeout(timer);
    if (timer != null) {
      timer.stop();
      timer = null;
    }
    changeState(-999);
  };



  var loop = function() {

    // console.log(timePassed);
    timeRemaning.text(Math.ceil(remain / 1000));
    var remainPercentage = 100 - (remain / loopInterval * 100);
    percentage.css('height', remainPercentage + "%");


    if (remain < 0) {
      //var time = parseInt($('#timevalue').val());
      remain = loopInterval;
      currentDamageTypeIndex++;
      if (currentDamageTypeIndex > 2) {
        currentDamageTypeIndex = 0;
      }
      timeRemaning.text(Math.ceil(remain / 1000));
      changeState(currentDamageTypeIndex);
    }


    remain = remain - interval;

    timePassed = timePassed + interval;
    //timer = setTimeout(loop, interval)





  };

  var changeState = function(index) {
    var damageType = null;
    if (index >= 0) {
      damageType = $(damageTypeButtons[index]).attr('id');
    }

    clear();



    var properties = {
      title: "",
      titleClassName: "",
      nextUpcomingClass: "",
      nextUpcommingDamage: "",
    };

    switch (damageType) {
      case 'solar':
        properties.title = '솔라';
        properties.titleClassName = colors.solar.primary;
        properties.nextUpcommingDamage = '다음 속성 보이드';
        properties.nextUpcomingClass = colors.void.secondary;
        break;
      case 'void':
        properties.title = '보이드';
        properties.titleClassName = colors.void.primary;
        properties.nextUpcommingDamage = '다음 속성 아크';
        properties.nextUpcomingClass = colors.arc.secondary;
        break;
      case 'arc':
        properties.title = '아크';
        properties.titleClassName = colors.arc.primary;
        properties.nextUpcommingDamage = '다음 속성 솔라';
        properties.nextUpcomingClass = colors.solar.secondary;
        break;

      default:
        properties.title = '';
        properties.titleClassName = colors.stop.primary;
        properties.nextUpcommingDamage = '';
        //properties.nextUpcomingClass = colors.stop.secondary;
        break;

    }
    currentDamageTypeTitle.text(properties.title);
    currentDamageTypeTitleWrapper.addClass(properties.titleClassName);

    nextUpcoming.addClass(properties.nextUpcomingClass);
    nextUpcoming.text(properties.nextUpcommingDamage);
    if (index >= 0) {
      timeRemaningBackground.addClass(properties.titleClassName);
    } else {
      timeRemaning.text('대기중');
    }
  };

  var clear = function() {

    percentage.css('height', '0%');
    $.each(colors, function(key, item) {
      currentDamageTypeTitleWrapper.removeClass(item.primary);
      timeRemaningBackground.removeClass(item.primary);
      nextUpcoming.removeClass(item.secondary);
    });

    currentDamageTypeTitleWrapper.removeClass('bg-grey-500');
  }

  var adjustingInterval = function(workFunc, interval, errorFunc) {
    var that = this;
    var expected, timeout;
    this.interval = interval;

    this.start = function() {
      expected = Date.now() + this.interval;
      timeout = setTimeout(step, this.interval);
    }

    this.stop = function() {
      clearTimeout(timeout);
    }

    function step() {
      var drift = Date.now() - expected;
      if (drift > that.interval) {
        // You could have some default stuff here too...
        if (errorFunc) errorFunc();
      }
      workFunc();
      expected += that.interval;
      timeout = setTimeout(step, Math.max(0, that.interval - drift));
    }
  };

  init();

});