
function vocabularyGame() {

  /*******************************
   * 2) BIẾN TRẠNG THÁI
   *******************************/
  const chineseListV = document.getElementById("chineseListV");
  const meanListV = document.getElementById("meanListV");
  const scoreElV = document.getElementById("scoreV");
  const mistakesElV = document.getElementById("mistakesV");
  const progressElV = document.getElementById("progressV");
  const noticeElV = document.getElementById("noticeV");
  const wordsPerRoundSelV = document.getElementById("wordsPerRoundV");
  const restartBtnV = document.getElementById("restartBtnV");
  const nextBtnV = document.getElementById("nextBtnV");
  
  let score = 0;
  let mistakes = 0;
  let order = [];   // mảng index đã xáo trộn toàn bộ
  let cursor = 0;   // con trỏ đang ở vị trí nào trong order
  let currentSlice = []; // index các từ của vòng hiện tại
  let matchesLeft = 0;
  
  let selectedChinese = null; // li
  let selectedMean = null;    // li
  
  /*******************************
   * 3) HÀM TIỆN ÍCH
   *******************************/
  function shuffle(arr) {
    // Fisher-Yates
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  
  function updateStats() {
    scoreElV.textContent = String(score);
    mistakesElV.textContent = String(mistakes);
  
    const wordsPerRound = getWordsPerRound();
    const totalRounds = Math.ceil(vocabulary.length / wordsPerRound);
    const played = Math.floor(cursor / wordsPerRound) + (matchesLeft === 0 && currentSlice.length ? 1 : 0);
    const currentRound = Math.min(played || 1, totalRounds) || 0;
  
    progressElV.textContent = `Vòng ${currentRound}/${totalRounds}`;
  }
  
  function getWordsPerRound() {
    return parseInt(wordsPerRoundSelV.value, 10) || 5;
  }
  
  function setNotice(msg = "") {
    noticeElV.textContent = msg;
  }
  
  /*******************************
   * 4) VÒNG CHƠI
   *******************************/
  function buildOrderAndReset() {
    order = shuffle([...Array(vocabulary.length).keys()]); // [0..N-1] xáo trộn
    cursor = 0;
    score = 0;
    mistakes = 0;
    selectedChinese = null;
    selectedMean = null;
    nextBtnV.disabled = true;
    setNotice("");
    renderRound();
    updateStats();
  }
  
  function renderRound() {
    chineseListV.innerHTML = "";
    meanListV.innerHTML = "";
    selectedChinese = null;
    selectedMean = null;
    nextBtnV.disabled = true;
  
    const wordsPerRound = getWordsPerRound();
    if (cursor >= order.length) {
      // Hết toàn bộ từ
      currentSlice = [];
      matchesLeft = 0;
      setNotice("🎉 Bạn đã chơi hết tất cả các từ! Nhấn Restart để chơi lại.");
      updateStats();
      return;
    }
  
    // Lấy mảng index cho vòng hiện tại
    currentSlice = order.slice(cursor, cursor + wordsPerRound);
    matchesLeft = currentSlice.length;
  
    // Tạo danh sách Chinese (xáo trộn trong phạm vi slice để vị trí đổi mỗi vòng)
    const chineseIndices = shuffle(currentSlice);
    for (const idx of chineseIndices) {
      const li = document.createElement("li");
      li.textContent = vocabulary[idx].chinese;
      li.dataset.idx = String(idx); // dùng index để đối chiếu
      li.addEventListener("click", () => onSelectChinese(li));
      chineseListV.appendChild(li);
    }
  
    // Tạo danh sách Mean (xáo trộn)
    const meanIndices = shuffle(currentSlice);
    for (const idx of meanIndices) {
      const li = document.createElement("li");
      li.textContent = vocabulary[idx].mean;
      li.dataset.idx = String(idx);
      li.addEventListener("click", () => onSelectMean(li));
      meanListV.appendChild(li);
    }
  
    setNotice(`Chọn cặp khớp nhau. Còn ${matchesLeft} cặp trong vòng này.`);
    updateStats();
  }
  
  function onSelectChinese(li) {
    if (li.classList.contains("disabled")) return;
    if (selectedChinese) selectedChinese.classList.remove("selected");
    selectedChinese = li;
    li.classList.add("selected");
    tryCheckMatch();
  }
  
  function onSelectMean(li) {
    if (li.classList.contains("disabled")) return;
    if (selectedMean) selectedMean.classList.remove("selected");
    selectedMean = li;
    li.classList.add("selected");
    tryCheckMatch();
  }
  
  function tryCheckMatch() {
    if (!selectedChinese || !selectedMean) return;
  
    const idxA = selectedChinese.dataset.idx;
    const idxB = selectedMean.dataset.idx;
  
    if (idxA === idxB) {
      // ĐÚNG
      selectedChinese.classList.remove("selected");
      selectedMean.classList.remove("selected");
      selectedChinese.classList.add("correct", "disabled");
      selectedMean.classList.add("correct", "disabled");
  
      score++;
      matchesLeft--;
      setNotice(`✅ Đúng! Còn ${matchesLeft} cặp.`);
  
      // reset selection
      selectedChinese = null;
      selectedMean = null;
  
      if (matchesLeft === 0) {
        // Vòng hoàn tất
        nextBtnV.disabled = false;
        setNotice("🎯 Hoàn thành vòng này! Nhấn Next Round để tiếp tục.");
      }
      updateStats();
    } else {
      // SAI
      selectedChinese.classList.add("wrong");
      selectedMean.classList.add("wrong");
      mistakes++;
      setNotice("❌ Sai rồi, thử lại nhé!");
  
      // Bỏ highlight sai sau 500ms
      const a = selectedChinese, b = selectedMean;
      selectedChinese = null;
      selectedMean = null;
      setTimeout(() => {
        a.classList.remove("selected", "wrong");
        b.classList.remove("selected", "wrong");
      }, 500);
  
      updateStats();
    }
  }
  
  function nextRound() {
    // Nhảy con trỏ đến sau slice hiện tại
    cursor += currentSlice.length;
    renderRound();
  }
  
  /*******************************
   * 5) SỰ KIỆN
   *******************************/
  restartBtnV.addEventListener("click", buildOrderAndReset);
  nextBtnV.addEventListener("click", nextRound);
  
  // Đổi số từ mỗi vòng → restart để tính lại tổng vòng & thứ tự
  wordsPerRoundSelV.addEventListener("change", buildOrderAndReset);
  
  /*******************************
   * 6) KHỞI ĐỘNG
   *******************************/
  buildOrderAndReset();
}


function pronunciatioGame() {

  /*******************************
   * 2) BIẾN TRẠNG THÁI
   *******************************/
  const chineseListP = document.getElementById("chineseListP");
  const pronunciationList = document.getElementById("pronunciationList");
  const scoreElP = document.getElementById("scoreP");
  const mistakesElP = document.getElementById("mistakesP");
  const progressElP = document.getElementById("progressP");
  const noticeElP = document.getElementById("noticeP");
  const wordsPerRoundSelP = document.getElementById("wordsPerRoundP");
  const restartBtnP = document.getElementById("restartBtnP");
  const nextBtnP = document.getElementById("nextBtnP");
  
  let score = 0;
  let mistakes = 0;
  let order = [];   // mảng index đã xáo trộn toàn bộ
  let cursor = 0;   // con trỏ đang ở vị trí nào trong order
  let currentSlice = []; // index các từ của vòng hiện tại
  let matchesLeft = 0;
  
  let selectedChinese = null; // li
  let selectedMean = null;    // li
  
  /*******************************
   * 3) HÀM TIỆN ÍCH
   *******************************/
  function shuffle(arr) {
    // Fisher-Yates
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  
  function updateStats() {
    scoreElP.textContent = String(score);
    mistakesElP.textContent = String(mistakes);
  
    const wordsPerRound = getWordsPerRound();
    const totalRounds = Math.ceil(vocabulary.length / wordsPerRound);
    const played = Math.floor(cursor / wordsPerRound) + (matchesLeft === 0 && currentSlice.length ? 1 : 0);
    const currentRound = Math.min(played || 1, totalRounds) || 0;
  
    progressElP.textContent = `Vòng ${currentRound}/${totalRounds}`;
  }
  
  function getWordsPerRound() {
    return parseInt(wordsPerRoundSelP.value, 10) || 5;
  }
  
  function setNotice(msg = "") {
    noticeElP.textContent = msg;
  }
  
  /*******************************
   * 4) VÒNG CHƠI
   *******************************/
  function buildOrderAndReset() {
    order = shuffle([...Array(vocabulary.length).keys()]); // [0..N-1] xáo trộn
    cursor = 0;
    score = 0;
    mistakes = 0;
    selectedChinese = null;
    selectedMean = null;
    nextBtnP.disabled = true;
    setNotice("");
    renderRound();
    updateStats();
  }
  
  function renderRound() {
    chineseListP.innerHTML = "";
    pronunciationList.innerHTML = "";
    selectedChinese = null;
    selectedMean = null;
    nextBtnP.disabled = true;
  
    const wordsPerRound = getWordsPerRound();
    if (cursor >= order.length) {
      // Hết toàn bộ từ
      currentSlice = [];
      matchesLeft = 0;
      setNotice("🎉 Bạn đã chơi hết tất cả các từ! Nhấn Restart để chơi lại.");
      updateStats();
      return;
    }
  
    // Lấy mảng index cho vòng hiện tại
    currentSlice = order.slice(cursor, cursor + wordsPerRound);
    matchesLeft = currentSlice.length;
  
    // Tạo danh sách Chinese (xáo trộn trong phạm vi slice để vị trí đổi mỗi vòng)
    const chineseIndices = shuffle(currentSlice);
    for (const idx of chineseIndices) {
      const li = document.createElement("li");
      li.textContent = vocabulary[idx].chinese;
      li.dataset.idx = String(idx); // dùng index để đối chiếu
      li.addEventListener("click", () => onSelectChinese(li));
      chineseListP.appendChild(li);
    }
  
    // Tạo danh sách pronunciation (xáo trộn)
    const meanIndices = shuffle(currentSlice);
    for (const idx of meanIndices) {
      const li = document.createElement("li");
      li.textContent = vocabulary[idx].pronunciation;
      li.dataset.idx = String(idx);
      li.addEventListener("click", () => onSelectMean(li));
      pronunciationList.appendChild(li);
    }
  
    setNotice(`Chọn cặp khớp nhau. Còn ${matchesLeft} cặp trong vòng này.`);
    updateStats();
  }
  
  function onSelectChinese(li) {
    if (li.classList.contains("disabled")) return;
    if (selectedChinese) selectedChinese.classList.remove("selected");
    selectedChinese = li;
    li.classList.add("selected");
    tryCheckMatch();
  }
  
  function onSelectMean(li) {
    if (li.classList.contains("disabled")) return;
    if (selectedMean) selectedMean.classList.remove("selected");
    selectedMean = li;
    li.classList.add("selected");
    tryCheckMatch();
  }
  
  function tryCheckMatch() {
    if (!selectedChinese || !selectedMean) return;
  
    const idxA = selectedChinese.dataset.idx;
    const idxB = selectedMean.dataset.idx;
  
    if (idxA === idxB) {
      // ĐÚNG
      selectedChinese.classList.remove("selected");
      selectedMean.classList.remove("selected");
      selectedChinese.classList.add("correct", "disabled");
      selectedMean.classList.add("correct", "disabled");
  
      score++;
      matchesLeft--;
      setNotice(`✅ Đúng! Còn ${matchesLeft} cặp.`);
  
      // reset selection
      selectedChinese = null;
      selectedMean = null;
  
      if (matchesLeft === 0) {
        // Vòng hoàn tất
        nextBtnP.disabled = false;
        setNotice("🎯 Hoàn thành vòng này! Nhấn Next Round để tiếp tục.");
      }
      updateStats();
    } else {
      // SAI
      selectedChinese.classList.add("wrong");
      selectedMean.classList.add("wrong");
      mistakes++;
      setNotice("❌ Sai rồi, thử lại nhé!");
  
      // Bỏ highlight sai sau 500ms
      const a = selectedChinese, b = selectedMean;
      selectedChinese = null;
      selectedMean = null;
      setTimeout(() => {
        a.classList.remove("selected", "wrong");
        b.classList.remove("selected", "wrong");
      }, 500);
  
      updateStats();
    }
  }
  
  function nextRound() {
    // Nhảy con trỏ đến sau slice hiện tại
    cursor += currentSlice.length;
    renderRound();
  }
  
  /*******************************
   * 5) SỰ KIỆN
   *******************************/
  restartBtnP.addEventListener("click", buildOrderAndReset);
  nextBtnP.addEventListener("click", nextRound);
  
  // Đổi số từ mỗi vòng → restart để tính lại tổng vòng & thứ tự
  wordsPerRoundSelP.addEventListener("change", buildOrderAndReset);
  
  /*******************************
   * 6) KHỞI ĐỘNG
   *******************************/
  buildOrderAndReset();
}

// Option game

const showVocabularyGame = document.getElementById("showVocabularyGame");
const isVocabularyGame = document.getElementById("isVocabularyGame");

const showPronunciationGame = document.getElementById("showPronunciationGame");
const isPronunciationGame = document.getElementById("isPronunciationGame");

showVocabularyGame.onclick = function() {
  isVocabularyGame.style.display = "block";
  isPronunciationGame.style.display = "none";
  vocabularyGame();
}

showPronunciationGame.onclick = function() {
  console.log("Check data");
  isVocabularyGame.style.display = "none";
  isPronunciationGame.style.display = "block";
  pronunciatioGame();
}



/*******************************
   * Mở danh sách từ vựng
   *******************************/
// Lấy phần tử
const modal = document.getElementById("vocabModal");
const btn = document.getElementById("showVocabularyBtn");
const span = document.querySelector(".close");
const vocabTableBody = document.getElementById("vocabTableBody");

// Khi click nút -> mở popup và render bảng
btn.onclick = function() {
  vocabTableBody.innerHTML = ""; // clear bảng cũ
  vocabulary.forEach((word, index) => {
    const row = `<tr>
      <td>${index + 1}</td>
      <td>${word.chinese}</td>
      <td>${word.mean}</td>
      <td>${word.pronunciation}</td>
      <td>${word.pinyin}</td>
    </tr>`;
    vocabTableBody.innerHTML += row;
  });
  modal.style.display = "block";
}

// Khi click nút đóng -> tắt popup
span.onclick = function() {
  modal.style.display = "none";
}

// Khi click ra ngoài popup -> cũng tắt
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
}


const radical = document.getElementById("radical");
const showRadicalBtn = document.getElementById("showRadicalBtn");
const closeRadicalBtn = document.getElementById("closeRadicalBtn");

showRadicalBtn.onclick = function() {
  radical.style.display = "block";
}

closeRadicalBtn.onclick = function() {
  radical.style.display = "none";
}