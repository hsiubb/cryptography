(function($) {
  const alphabet_len = 26;
  const upper = [65, 90];
  const lower = [97, 122];

  let substitution_num = 2;
  let morse_code = {
    "*-"    : "A",
    "-***"  : "B",
    "-*-*"  : "C",
    "-**"   : "D",
    "*"     : "E",
    "**-*"  : "F",
    "--*"   : "G",
    "****"  : "H",
    "**"    : "I",
    "*---"  : "J",
    "-*-"   : "K",
    "*-**"  : "L",
    "--"    : "M",
    "-*"    : "N",
    "---"   : "O",
    "*--*"  : "P",
    "--*-"  : "Q",
    "*-*"   : "R",
    "***"   : "S",
    "-"     : "T",
    "**-"   : "U",
    "***-"  : "V",
    "*--"   : "W",
    "-**-"  : "X",
    "-*--"  : "Y",
    "--**"  : "Z",
    "*----" : "1",
    "**---" : "2",
    "***--" : "3",
    "****-" : "4",
    "*****" : "5",
    "-****" : "6",
    "--***" : "7",
    "---**" : "8",
    "----*" : "9",
    "-----" : "0"
  };

  String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, "");
  }

  function get_color(i) {
    let colors = ["#336","#9C3","#369","#036","#699","#039","#39C","#333","#993","#369","#333","#666","#9C3","#036","#369","#333","#36C","#CC6","#330","#69C","#069","#000","#036","#336","#069"];

    // return colors[ Math.floor( Math.random() * colors.length ) ];
    return colors[i];
  }

  function substitution_cols() {
    $('.cols a').on('click', function(evnt) {
      evnt.preventDefault();
      $(this).addClass('active').siblings('.active').removeClass('active');
      if($(this).parent().prop('id') === "substitution_cols") {
        substitution_num = ~~$(this).html();
      }
      $('#cypher_input').keyup();
    });

    $('#substitution_num').on('keyup', function() {
      let val = $(this).val();
      if(!val) {
        substitution_num = 2;
        $('#cypher_input').keyup();
      } else {
        if(isNaN(Number(val))) {
          $('#substitution .plaintext').html('<p class="error">栅栏数出错</p>');
        } else {
          substitution_num = Number(val);
          $('#cypher_input').keyup();
        }
      }
    });
  }

  function caesar(ciphertext) {
    let letters = ciphertext.split('');
    $('#caesar .plaintext').html('');
    for(let i=1; i<alphabet_len; i++) {
      let color = get_color(i-1);
      letters = letters.map(function(val) {
        let unicode = val.codePointAt(0);
        let min = 0, max = 0;
        if(unicode >= upper[0] && unicode <= upper[1]) {
          min = upper[0];
          max = upper[1];
        } else if(unicode >= lower[0] && unicode <= lower[1]) {
          min = lower[0];
          max = lower[1];
        }
        if(min !== 0) {
          unicode = val.codePointAt(0) + 1;
          if(unicode > max) {
            unicode -= alphabet_len;
          }
        }
        return String.fromCharCode(unicode);
      });
      $('#caesar .plaintext').append('<p class="caesar-line" style="color: '+color+'">'+letters.join('')+'</p>');
    }
  }

  function morse(ciphertext) {
    let illegal_data = false;
    ciphertext = ciphertext.replace(/1/g,"-").replace(/0/g,"*").replace(/\//g," ").trim();

    ciphertext.split('').map(function(val) {
      if(val != '-' && val !='*' && val !=' '){
        illegal_data = true;
      }
    });
    if(illegal_data) {
      $('#morse .plaintext').html('<p class="error">输入了非摩斯电码数据</p>');
    } else {
      ciphertext = ciphertext.split(/\s+/g);

      let plaintext = '';
      if(ciphertext.length > 0) {
        ciphertext.reduce(function(ciphertext, val) {
          if(morse_code[val]) {
            plaintext += morse_code[val];
            return ciphertext + val + ' ';
          } else {
            plaintext = '字符出错，出错项为：'+ ciphertext + ' <span class="error">' + val + '</span>';
            return ;
          }
        }, '');
      } else {
        plaintext = '';
      }

      $('#morse .plaintext').html('<p class="plain-text">'+plaintext+'</p>');
    }
  }

  function substitution(ciphertext) {
    ciphertext = ciphertext.split('');
    let text_arr = [];
    if(ciphertext.length % substitution_num !== 0) {
      $('#substitution .plaintext').html('<p class="error">字数不符，应为 '+substitution_num+' 的倍数。</p>');
      return ;
    }
    ciphertext.map(function(val, idx) {
      if(!text_arr[idx % substitution_num]) {
        text_arr[idx % substitution_num] = '';
      }
      text_arr[idx % substitution_num] += ' '+val;
    });
    let plaintext = '';
    text_arr.map(function(val) {
      plaintext += '<p>'+val+'</p>';
    });

    $('#substitution .plaintext').html(plaintext + '<p class="substitution-plaintext plain-text">'+text_arr.join('').replace(/\s+/g, "")+'</p>');
  }

  function reverse(ciphertext) {
    let plaintext = '<p>a b c d e f g h i j k l m n o p q r s t u v w x y z</p>' +
      '<p>↓↓↓</p>' +
      '<p>z y x w v u t s r q p o n m l k j i h g f e d c b a</p>' +
      '<br><br>'+
      '<p class="plain-text">' + ciphertext.split('').reverse().join('') + '</p>';
    $('#reverse .plaintext').html('<p class="plain-text">'+plaintext+'</p>');
  }

  function rotate13(ciphertext) {
    ciphertext = ciphertext.split('');
    let plaintext = ciphertext.map(function(val) {
      val = val.toLowerCase().codePointAt(0);
      if(val >= lower[0] && val <= lower[1]) {
        val = val + alphabet_len / 2;
        if(val > 122) {
          val -= alphabet_len;
        }
      }
      return String.fromCharCode(val);
    });
    plaintext = '<p>a b c d e f g h i j k l m</p>' +
      '<p>↑↑↑</p>' +
      '<p>↓↓↓</p>' +
      '<p>n o p q r s t u v w x y z</p>' +
      '<br><br>' +
      '<p class="plain-text">' + plaintext.join('') + '</p>';
    $('#rotate13 .plaintext').html(plaintext);
  }

  function init() {
    $('#nav a').on('click', function(evnt) {
      let target = $(this).attr('data-target');
      $(this).addClass('active').parent().siblings().children().removeClass('active');
      $('#' + target).fadeIn().siblings('section').hide();
      $('.cypher-info').hide().parent().children('[data-get="' + target + '"]').fadeIn();
      $('#cypher_input').keyup();
    });
    $('#'+$('#nav .active').attr('data-target')).fadeIn();

    $('#caesar').on('click', '.caesar-line', function() {
      let that = this;
      let range = document.createRange();
      range.selectNode(that);
      window.getSelection().addRange(range);
      document.execCommand('copy');

      $(this).addClass('hover').on('mouseout', function() {
        if($(this).hasClass('hover')) {
          $(this).removeClass('hover');
          $('#nav .active').click();
        }
      });
    });

    $('#cypher_input').on('keyup', function(evnt) {
      let val = $(this).val();
      $('.searching-info').html('密文长度为：'+val.length);
      let decoding = $('#nav .active').attr('data-target');

      switch(decoding) {
        case 'caesar'          : caesar(val);          break;
        case 'morse'           : morse(val);           break;
        case 'substitution'    : substitution(val);    break;
        case 'reverse'         : reverse(val);         break;
        case 'rotate13'        : rotate13(val);        break;
        default:;
      }
    });

    substitution_cols();

    if(!!$('#cypher_input').val()) {
      $('#cypher_input').keyup();
    }
  }

  init();
})(jQuery);
