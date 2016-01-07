$(document).ready(function() {

  var work_minutes = 0;
  var work_seconds = 0;
  var break_minutes = 0;
  var break_seconds = 0;
  var prev_minutes;
  var prev_seconds;
  var workTimeUpdate;
  var breakTimeUpdate;

  $("#start_pause_resume").prop("disabled", true);
  $("#reset").prop("disabled", true);

  $("input[name='work_time']").change(function() {
    $("input[name='break_time']").change(function() {
      $("#start_pause_resume").prop("disabled", false);
      $("#reset").prop("disabled", false);
    });
  });
  
  $("input[name='break_time']").change(function() {
    $("input[name='work_time']").change(function() {
      $("#start_pause_resume").prop("disabled", false);
      $("#reset").prop("disabled", false);
    });
  });

  $("#start_pause_resume").click(function() {
    if ($(this).text() == "Start") {
      $(this).html("Pause");
      $("#status").html("Get to work!");
      updateWorkTime(0, 0);
      $("input[name='work_time']").attr("disabled", true);
      $("input[name='break_time']").attr("disabled", true);
    } else if ($(this).text() == "Pause") {
      if ($("#status").text() == "Get to work!") {
        clearInterval(workTimeUpdate);
      } else if ($("#status").text() == "Take a break!") {
        clearInterval(breakTimeUpdate);
      }
      $(this).html("Resume");
    } else if ($(this).text() == "Resume") {
      if ($("#status").text() == "Get to work!") {
        prev_minutes = parseInt($("#work_minutes").html());
        prev_seconds = parseInt($("#work_seconds").html());
        updateWorkTime(prev_minutes, prev_seconds);
      } else if ($("#status").text() == "Take a break!") {
        prev_minutes = parseInt($("#break_minutes").html());
        prev_seconds = parseInt($("#break_seconds").html());
        updateBreakTime(prev_minutes, prev_seconds);
      }
      $(this).html("Pause");
    }
  });

  $("#reset").click(function() {
    if ($("#status").text() == "Get to work!") {
      if (workTimeUpdate) clearInterval(workTimeUpdate);
    } else if ($("#status").text() == "Take a break!") {
      if (breakTimeUpdate) clearInterval(breakTimeUpdate);
    }
    $("input[name='work_time']").attr("disabled", false);
    $("input[name='break_time']").attr("disabled", false);
    setWorkStopwatch(0, 0);
    setBreakStopwatch(0, 0);
    $("#status").html("");
    $("#progressbar").progressbar("destroy");
    $("#start_pause_resume").html("Start");
  });

  function updateWorkTime(prev_minutes, prev_seconds) {
    var startTime = new Date();

    workTimeUpdate = setInterval(function() {
      var timeElapsed = new Date().getTime() - startTime.getTime();

      work_minutes = parseInt(timeElapsed / 1000 / 60) + prev_minutes;
      if (work_minutes > 60) work_minutes %= 60;

      work_seconds = parseInt(timeElapsed / 1000) + prev_seconds;
      if (work_seconds > 60) work_seconds %= 60;

      setWorkStopwatch(work_minutes, work_seconds);
      moveWorkBar(work_minutes, work_seconds);
      checkWorkTime(work_minutes);

    }, 1000);

  }

  function updateBreakTime(prev_minutes, prev_seconds) {
    var startTime = new Date();

    breakTimeUpdate = setInterval(function() {
      var timeElapsed = new Date().getTime() - startTime.getTime();

      break_minutes = parseInt(timeElapsed / 1000 / 60) + prev_minutes;
      if (break_minutes > 60) break_minutes %= 60;

      break_seconds = parseInt(timeElapsed / 1000) + prev_seconds;
      if (break_seconds > 60) break_seconds %= 60;

      setBreakStopwatch(break_minutes, break_seconds);
      moveBreakBar(break_minutes, break_seconds);
      checkBreakTime(break_minutes);

    }, 1000);

  }

  function setWorkStopwatch(work_minutes, work_seconds) {

    $("#work_minutes").html(prependZero(work_minutes, 2));
    $("#work_seconds").html(prependZero(work_seconds, 2));

  }

  function setBreakStopwatch(break_minutes, break_seconds) {

    $("#break_minutes").html(prependZero(break_minutes, 2));
    $("#break_seconds").html(prependZero(break_seconds, 2));

  }

  function prependZero(time, length) {
    time = new String(time);
    return new Array(Math.max(length - time.length + 1, 0)).join("0") + time;
  }

  function checkWorkTime(work_minutes) {
    var get_work_time = $("input[name='work_time']:checked").val();
    if (work_minutes >= get_work_time) {
      var sound = 'http://www.oringz.com/oringz-uploads/7f_in-a-hurry-song.mp3';
      var audio = new Audio(sound);
      audio.play();
      $("#status").html("Take a break!");
      clearInterval(workTimeUpdate);
      $("#work_minutes").html("00");
      $("#work_seconds").html("00");
      updateBreakTime(0, 0);
    }
  }

  function checkBreakTime(break_minutes) {
    var get_break_time = $("input[name='break_time']:checked").val();
    if (break_minutes >= get_break_time) {
      var sound = 'http://www.oringz.com/oringz-uploads/7f_in-a-hurry-song.mp3';
      var audio = new Audio(sound);
      audio.play();
      $("#status").html("Get to work!");
      clearInterval(breakTimeUpdate);
      $("#break_minutes").html("00");
      $("#break_seconds").html("00");
      updateWorkTime(0, 0);
    }
  }

  function moveWorkBar(work_minutes, work_seconds) {
    var get_work_time = $("input[name='work_time']:checked").val();
    var show_value = (((work_minutes * 60) + work_seconds) / (get_work_time * 60)) * 100;
    $("#progressbar").progressbar({
      value: show_value
    });
  }

  function moveBreakBar(break_minutes, break_seconds) {
    var get_break_time = $("input[name='break_time']:checked").val();
    var show_value = (((break_minutes * 60) + break_seconds) / (get_break_time * 60)) * 100;
    $("#progressbar").progressbar({
      value: show_value
    });
  }
});