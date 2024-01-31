const modalsignup = document.querySelector("#modalsignup");
const loginUser = document.querySelector("#profile");
const modalsignIn = document.querySelector("#modalsignIn");
if (!localStorage.getItem('user')) {
  modalsignup.style.display = 'block';
} else profile.style.display = 'block'
function changeToLogin(){
  modalsignup.style.display = 'none';
  modalsignIn.style.display = 'block';
}
const loginUsers = async(event) =>{
  try{
    event.preventDefault()
    modalsignup.style.display = 'none';
    modalsignIn.style.display = 'block';
    const username = document.getElementById('usernameInputt').value;
    const password = document.getElementById('passwordInputt').value;
    const url = 'http://localhost:3003/login';
  
   const req = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
    const res = await req.json()
     
        if (req.status === 200) {
          localStorage.setItem('user', res.username)
          localStorage.setItem('infoUser', JSON.stringify(res))
          window.location.reload()
        } else if (req.status === 400) {
          return alert("invalid login or password")
        } else if (req.status === 404) {
          console.log('Ресурс не найден');
        } else {
          console.log('Другой статус ответа');
        }
  
      
  }catch(erro) {
    console.error('Ошибка при запросе:', error);
  }
 

    
    
}
function registerUsers(){
  modalsignup.style.display = 'block';
  modalsignIn.style.display = 'none';
}
const getData = async () => {
  try {
    const req = await fetch('http://localhost:3003/getData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: localStorage.getItem("user")
      }),
    })
    const res = await req.json()
    const myButton = document.getElementById('spin');
    myButton.textContent = `SPIN  ${res.spins}`;

    localStorage.removeItem("history")
    localStorage.setItem("infoUser", JSON.stringify(res))
  } catch (err) {
    console.log(err);
  }
}
getData()


const prizes = [
  {
    text: "Iphone 15  <br />pro max",
    color: "#dc1e1e",
    src: "./iphone15promax.png"

  },
  {
    text: "100$",
    color: "white",
    src: "./money.png"


  },

  {
    text: "Iphone 15  <br />pro",
    color: "#dc1e1e",
    src: "./iphone15promax.png"


  },
  {
    text: "",
    color: "white",
    src: "./cross.png"


  },



  {
    text: "500$",
    color: "#dc1e1e",
    src: "./money.png"


  },
  {
    text: "Iphone 15",
    color: "white",
    src: "./iphone15promax.png"


  },
  {
    text: "1000$",
    color: "#dc1e1e",
    src: "./money.png"


  },

  {
    text: "",
    color: "white",
    src: "./vozvrat.png"


  },

];

// функция выбора призового сектора с учетом шансов

window.addEventListener('load', updateStyles);
window.addEventListener('resize', updateStyles);

function updateStyles() {
  const prizeNodes = document.querySelectorAll('.prize span');

  // Получаем ширину экрана
  const screenWidth = window.innerWidth;

  // Устанавливаем размер шрифта в зависимости от размера экрана
  if (screenWidth <= 600) {
    prizeNodes.forEach(node => {
      node.style.fontSize = '8px';
    });
  } else {
    prizeNodes.forEach(node => {
      node.style.fontSize = '18px'; // Размер шрифта для больших экранов
    });
  }
}


// создаём переменные для быстрого доступа ко всем объектам на странице — блоку в целом, колесу, кнопке и язычку
const wheel = document.querySelector(".deal-wheel");
const spinner = wheel.querySelector(".spinner");
const trigger = wheel.querySelector(".btn-spin");
const ticker = wheel.querySelector(".ticker");
const modalX = document.querySelector('#modalX');
const modalV = document.querySelector('#modalV');
const modalI15max = document.querySelector('#modalI15max');
const modalI15pro = document.querySelector('#modalI15pro');
const modalI15 = document.querySelector('#modalI15');
const modal100 = document.querySelector('#modal100');
const modal500 = document.querySelector('#modal500');
const modal1000 = document.querySelector('#modal1000');
const modalBuy = document.querySelector('#modalBuy');

// на сколько секторов нарезаем круг
const prizeSlice = 360 / prizes.length;
// на какое расстояние смещаем сектора друг относительно друга
const prizeOffset = Math.floor(180 / prizes.length);
// прописываем CSS-классы, которые будем добавлять и убирать из стилей
const spinClass = "is-spinning";
const selectedClass = "selected";
// получаем все значения параметров стилей у секторов
const spinnerStyles = window.getComputedStyle(spinner);

// переменная для анимации
let tickerAnim;
// угол вращения
let rotation = 0;
// текущий сектор
let currentSlice = 0;
// переменная для текстовых подписей
let prizeNodes;

// расставляем текст по секторам
const createPrizeNodes = () => {
  // обрабатываем каждую подпись
  prizes.forEach(({ text, src, color, reaction }, i) => {
    // каждой из них назначаем свой угол поворота
    const rotation = ((prizeSlice * i) * -1) - prizeOffset;
    // добавляем код с размещением текста на страницу в конец блока spinner
    spinner.insertAdjacentHTML(
      "beforeend",
      // текст при этом уже оформлен нужными стилями
      `<li class="prize" data-reaction=${reaction} style="--rotate: ${rotation}deg ; position:reletive ">
        <img src=${src}  style="transform: rotate(270deg) ; width:30% ; position: absolute ; left: 10px" />
        <span style="transform: rotate(270deg) ; font-size:8px; position: absolute ; left: 35% ; font-weight: bold ; text-align:center">${text}</span>
      </li>`
    );
  });
};

// рисуем разноцветные секторы
const createConicGradient = () => {
  // устанавливаем нужное значение стиля у элемента spinner
  spinner.setAttribute(
    "style",
    `background: conic-gradient(
      from -90deg,
      ${prizes
      // получаем цвет текущего сектора
      .map(({ color }, i) => `${color} 0 ${(100 / prizes.length) * (prizes.length - i)}%`)
      .reverse()
    }
    );`
  );
};

// создаём функцию, которая нарисует колесо в сборе
const setupWheel = () => {
  // сначала секторы
  createConicGradient();
  // потом текст
  createPrizeNodes();
  // а потом мы получим список всех призов на странице, чтобы работать с ними как с объектами
  prizeNodes = wheel.querySelectorAll(".prize");
};

// определяем количество оборотов, которое сделает наше колесо
const spinertia = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// функция запуска вращения с плавной остановкой
const runTickerAnimation = () => {
  // взяли код анимации отсюда: https://css-tricks.com/get-value-of-css-rotation-through-javascript/
  const values = spinnerStyles.transform.split("(")[1].split(")")[0].split(",");
  const a = values[0];
  const b = values[1];
  let rad = Math.atan2(b, a);

  if (rad < 0) rad += (2 * Math.PI);

  const angle = Math.round(rad * (180 / Math.PI));
  const slice = Math.floor(angle / prizeSlice);

  // анимация язычка, когда его задевает колесо при вращении
  // если появился новый сектор
  if (currentSlice !== slice) {
    // убираем анимацию язычка
    ticker.style.animation = "none";
    // и через 10 миллисекунд отменяем это, чтобы он вернулся в первоначальное положение
    setTimeout(() => ticker.style.animation = null, 10);
    // после того, как язычок прошёл сектор - делаем его текущим 
    currentSlice = slice;
  }
  // запускаем анимацию
  tickerAnim = requestAnimationFrame(runTickerAnimation);
};

// функция выбора призового сектора
// const selectPrize = () => {
//   let totalChances = prizes.reduce((sum, prize) => sum + prize.chance, 0);
//   let randomValue = Math.random() * totalChances;
//   let accumulatedChances = 0;

//   for (let i = 0; i < prizes.length; i++) {
//       accumulatedChances += prizes[i].chance;

//       if (randomValue < accumulatedChances) {
//           prizeNodes[i].classList.add(selectedClass);
//       console.log(accumulatedChances)

//           break;
//       }
//   }
// };


// отслеживаем нажатие на кнопку



trigger.addEventListener("click", async () => {
  let config = true;

  const spinConfirm = async () => {
    try {
      const req = await fetch('http://localhost:3003/spins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: localStorage.getItem("user"),
        })
      });


      if (!req.ok) {
        config = false;
        return;
      }

      const res = await req.json();
    } catch (err) {
      console.log(err);
    }
  };

  await spinConfirm()
  if(!config){
    return modalBuy.style.display = "block"
  }

  // делаем её недоступной для нажатия
  trigger.disabled = true;
  // задаём начальное вращение колеса
  let num = Math.ceil(Math.random() * 100000)


  const addProduct = async (num) => {
    try {
      const req = await fetch('http://localhost:3003/addproduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: localStorage.getItem("user"),
          name: (() => {
            switch (num) {
              case 1: return "Iphone 15";
              case 2: return "Iphone 15 pro";
              case 3: return "Iphone 15 pro max";
              case 4: return "1000$";
              case 5: return "500$";
              case 6: return "100$";
              case 7: return "return";
              case 8: return "nothing";
              default:
                return;
            }
          })(),
          src: (() => {
            switch (num) {
              case 8: return "./cross.png";
              case 7: return "./vozvrat.png";
              case 6: return "./money.png";
              case 5: return "./money.png";
              case 4: return "./money.png";
              case 3: return "./iphone15promax.png";
              case 2: return "./iphone15promax.png";
              case 1: return "./iphone15promax.png";
              default:
                return;
            }
          })(),
        }),
      })
    }
    catch (err) {
      console.log(err);
    }
  }
  if (num >= 10000) {
    addProduct(8)

    rotation = Math.floor(1.08 * 720 + spinertia(100, 100));

    setTimeout(() => {
      modalX.style.display = 'block';
    }, 8000)
  } else if (num > 6 && num < 10000) {
    addProduct(7)

    rotation = Math.floor(1.25 * 480 + spinertia(100, 100));
    setTimeout(() => {
      modalV.style.display = 'block';
    }, 8000)
  } else if (num === 6) {
    //100$
    addProduct(6)
    rotation = Math.floor(1.44 * 480 + spinertia(100, 100));

    setTimeout(() => {
      modal100.style.display = 'block';
    }, 8000)
  }

  else if (num === 5) {
    //500$
    addProduct(5)

    rotation = Math.floor(1.70 * 480 + spinertia(100, 100));
    setTimeout(() => {
      modal500.style.display = 'block';
    }, 8000)
  }

  else if (num === 4) {
    //1000$
    addProduct(4)

    rotation = Math.floor(1.90 * 480 + spinertia(100, 100));
    setTimeout(() => {
      modal1000.style.display = 'block';
    }, 8000)
  }

  else if (num === 3) {
    //15 pro max
    rotation = Math.floor(2.10 * 480 + spinertia(100, 100));
    addProduct(3)
    setTimeout(() => {
      modalI15max.style.display = 'block';
    }, 8000)
  }

  else if (num === 2) {
    addProduct(2)
    rotation = Math.floor(2.30 * 480 + spinertia(100, 100));

    setTimeout(() => {
      modalI15pro.style.display = 'block';
    }, 8000)
    //15 pro
  }

  else if (num === 1) {
    addProduct(1)
    rotation = Math.floor(2.55 * 480 + spinertia(100, 100));

    setTimeout(() => {
      modalI15.style.display = 'block';
    }, 8000)
    //15
  }





  prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
  // добавляем колесу класс is-spinning, с помощью которого реализуем нужную отрисовку
  wheel.classList.add(spinClass);
  // через CSS говорим секторам, как им повернуться
  spinner.style.setProperty("--rotate", rotation);
  // возвращаем язычок в горизонтальную позицию
  ticker.style.animation = "none";
  // запускаем анимацию вращение
  runTickerAnimation();
});

// отслеживаем, когда закончилась анимация вращения колеса
spinner.addEventListener("transitionend", () => {
  // останавливаем отрисовку вращения
  cancelAnimationFrame(tickerAnim);
  // получаем текущее значение поворота колеса
  rotation %= 360;
  // выбираем приз

  // убираем класс, который отвечает за вращение
  wheel.classList.remove(spinClass);
  // отправляем в CSS новое положение поворота колеса
  spinner.style.setProperty("--rotate", rotation);
  // делаем кнопку снова активной
  trigger.disabled = false;

});

// подготавливаем всё к первому запуску
setupWheel();






window.onclick = function (event) {
  if (event.target == modalX) {
    window.location.reload();

    modalX.style.display = 'none';
  } else if (event.target == modalV) {
    window.location.reload();

    modalV.style.display = 'none';
  } else if (event.target == modalI15max) {
    window.location.reload();

    modalI15max.style.display = 'none';
  } else if (event.target == modalI15pro) {
    window.location.reload();

    modalI15pro.style.display = 'none';
  } else if (event.target == modalI15) {
    window.location.reload();

    modalI15.style.display = 'none';
  } else if (event.target == modal100) {
    window.location.reload();

    modal100.style.display = 'none';
  } else if (event.target == modal500) {
    modal500.style.display = 'none';
  } else if (event.target == modal1000) {
    window.location.reload();

    modal1000.style.display = 'none';
  } else if (event.target == modalsignup) {
    window.location.reload();

    modalsignup.style.display = 'none';
  }
  else if (event.target == modalBuy) {
    window.location.reload();

    modalBuy.style.display = 'none';
  }
};


function registerUser(event) {
  event.preventDefault()
  const username = document.getElementById('usernameInput').value;
  const password = document.getElementById('passwordInput').value;
  const url = 'http://localhost:3003/register';

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then(response => {
      // Здесь можно добавить логику в зависимости от статуса
      if (response.status === 200) {
        localStorage.setItem('user', username)
        window.location.reload();
      } else if (response.status === 400) {
        console.log('Ошибка в запросе от клиента');
      } else if (response.status === 404) {
        return alert("username already exists")
      }
      else if (response.status === 500) {
        return alert('Password must be 8 to 18 characters long');

      } else {
        alert("error")
      }

      return response.json();
    })

    .catch(error => {
      console.error('Ошибка при запросе:', error);
    });
}





const buyButton = document.getElementById('buy1')
console.log(buyButton);
buyButton.addEventListener("click" , () => {
  fetch("/buy-ticket" ,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items : [
        {id : 1 , quantity : 3},
        {id : 2 , quantity : 1},
      ],
      user: localStorage.getItem('user')
    }),
  })
  .then(res => {
    if(res.ok) return res.json()
    return res.json().then(json => Promise.reject(json))
  })
  .then(({url}) => {
    window.location = url
  })
  .catch(e => {
    console.error(e.error)
  })
})