

/*******************************
 * 2) BIẾN TRẠNG THÁI
 *******************************/
const chineseList = document.getElementById("chineseList");
const meanList = document.getElementById("meanList");
const scoreEl = document.getElementById("score");
const mistakesEl = document.getElementById("mistakes");
const progressEl = document.getElementById("progress");
const noticeEl = document.getElementById("notice");
const wordsPerRoundSel = document.getElementById("wordsPerRound");
const restartBtn = document.getElementById("restartBtn");
const nextBtn = document.getElementById("nextBtn");

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
  scoreEl.textContent = String(score);
  mistakesEl.textContent = String(mistakes);

  const wordsPerRound = getWordsPerRound();
  const totalRounds = Math.ceil(vocabulary.length / wordsPerRound);
  const played = Math.floor(cursor / wordsPerRound) + (matchesLeft === 0 && currentSlice.length ? 1 : 0);
  const currentRound = Math.min(played || 1, totalRounds) || 0;

  progressEl.textContent = `Vòng ${currentRound}/${totalRounds}`;
}

function getWordsPerRound() {
  return parseInt(wordsPerRoundSel.value, 10) || 5;
}

function setNotice(msg = "") {
  noticeEl.textContent = msg;
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
  nextBtn.disabled = true;
  setNotice("");
  renderRound();
  updateStats();
}

function renderRound() {
  chineseList.innerHTML = "";
  meanList.innerHTML = "";
  selectedChinese = null;
  selectedMean = null;
  nextBtn.disabled = true;

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
    chineseList.appendChild(li);
  }

  // Tạo danh sách Mean (xáo trộn)
  const meanIndices = shuffle(currentSlice);
  for (const idx of meanIndices) {
    const li = document.createElement("li");
    li.textContent = vocabulary[idx].mean;
    li.dataset.idx = String(idx);
    li.addEventListener("click", () => onSelectMean(li));
    meanList.appendChild(li);
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
      nextBtn.disabled = false;
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
restartBtn.addEventListener("click", buildOrderAndReset);
nextBtn.addEventListener("click", nextRound);

// Đổi số từ mỗi vòng → restart để tính lại tổng vòng & thứ tự
wordsPerRoundSel.addEventListener("change", buildOrderAndReset);

/*******************************
 * 6) KHỞI ĐỘNG
 *******************************/
buildOrderAndReset();
