function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast show";

  setTimeout(() => {
    toast.className = "toast";
  }, 2000); // 3 giây rồi biến mất
}

// feature copy
function onCopyCell(e) {
  if (!e.target.classList.contains('copy_word')) return;
  const text = e.target.innerText.trim();
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Đã copy: ${text}`);
  }).catch(console.error);
}




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

  let activeVocabulary = vocabulary; // mặc định dùng toàn bộ
  let limitWords = null; // số từ cuối muốn lấy (null = lấy hết)

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
    const totalRounds = Math.ceil(activeVocabulary.length / wordsPerRound);
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
    // Xác định vocabulary đang chơi
    if (limitWords && limitWords > 0 && limitWords < vocabulary.length) {
      activeVocabulary = vocabulary.slice(-limitWords); // lấy N từ cuối
    } else {
      activeVocabulary = vocabulary;
    }

    // Xáo trộn index dựa trên activeVocabulary
    order = shuffle([...Array(activeVocabulary.length).keys()]);
    // order = shuffle([...Array(vocabulary.length).keys()]); // [0..N-1] xáo trộn
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
      li.textContent = activeVocabulary[idx].chinese;
      li.dataset.idx = String(idx); // dùng index để đối chiếu
      li.classList.add("copy_word");
      li.addEventListener("click", onCopyCell);
      li.addEventListener("click", () => onSelectChinese(li));
      chineseListV.appendChild(li);
    }

    // Tạo danh sách Mean (xáo trộn)
    const meanIndices = shuffle(currentSlice);
    for (const idx of meanIndices) {
      const li = document.createElement("li");
      li.textContent = activeVocabulary[idx].mean;
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

  document.getElementById("applyLimitBtnV").addEventListener("click", () => {
    const val = parseInt(document.getElementById("limitWordsV").value, 10);
    if (!isNaN(val) && val > 0) {
      limitWords = val;
    } else {
      limitWords = null; // reset về tất cả
    }
    buildOrderAndReset();
  });
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
      li.classList.add("copy_word");
      li.addEventListener("click", onCopyCell);
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

function pinyinGame() {

  /*******************************
   * 2) BIẾN TRẠNG THÁI
   *******************************/
  const chineseListPinyin = document.getElementById("chineseListPinyin");
  const pinyinList = document.getElementById("pinyinList");
  const scoreElPinyin = document.getElementById("scorePinyin");
  const mistakesElPinyin = document.getElementById("mistakesPinyin");
  const progressElPinyin = document.getElementById("progressPinyin");
  const noticeElPinyin = document.getElementById("noticePinyin");
  const wordsPerRoundSelPinyin = document.getElementById("wordsPerRoundPinyin");
  const restartBtnPinyin = document.getElementById("restartBtnPinyin");
  const nextBtnPinyin = document.getElementById("nextBtnPinyin");

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
    scoreElPinyin.textContent = String(score);
    mistakesElPinyin.textContent = String(mistakes);

    const wordsPerRound = getWordsPerRound();
    const totalRounds = Math.ceil(vocabulary.length / wordsPerRound);
    const played = Math.floor(cursor / wordsPerRound) + (matchesLeft === 0 && currentSlice.length ? 1 : 0);
    const currentRound = Math.min(played || 1, totalRounds) || 0;

    progressElPinyin.textContent = `Vòng ${currentRound}/${totalRounds}`;
  }

  function getWordsPerRound() {
    return parseInt(wordsPerRoundSelPinyin.value, 10) || 5;
  }

  function setNotice(msg = "") {
    noticeElPinyin.textContent = msg;
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
    nextBtnPinyin.disabled = true;
    setNotice("");
    renderRound();
    updateStats();
  }

  function renderRound() {
    chineseListPinyin.innerHTML = "";
    pinyinList.innerHTML = "";
    selectedChinese = null;
    selectedMean = null;
    nextBtnPinyin.disabled = true;

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
      li.classList.add("copy_word");
      li.addEventListener("click", onCopyCell);
      li.addEventListener("click", () => onSelectChinese(li));
      chineseListPinyin.appendChild(li);
    }

    // Tạo danh sách pinyin (xáo trộn)
    const meanIndices = shuffle(currentSlice);
    for (const idx of meanIndices) {
      const li = document.createElement("li");
      li.textContent = vocabulary[idx].pinyin;
      li.dataset.idx = String(idx);
      li.addEventListener("click", () => onSelectMean(li));
      pinyinList.appendChild(li);
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
        nextBtnPinyin.disabled = false;
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
  restartBtnPinyin.addEventListener("click", buildOrderAndReset);
  nextBtnPinyin.addEventListener("click", nextRound);

  // Đổi số từ mỗi vòng → restart để tính lại tổng vòng & thứ tự
  wordsPerRoundSelPinyin.addEventListener("change", buildOrderAndReset);

  /*******************************
   * 6) KHỞI ĐỘNG
   *******************************/
  buildOrderAndReset();
}

function sentenceGame() {

  /*******************************
   * 2) BIẾN TRẠNG THÁI
   *******************************/
  const chineseListSentence = document.getElementById("chineseListSentence");
  const sentenceList = document.getElementById("sentenceList");
  const scoreElSentence = document.getElementById("scoreSentence");
  const mistakesElSentence = document.getElementById("mistakesSentence");
  const progressElSentence = document.getElementById("progressSentence");
  const noticeElSentence = document.getElementById("noticeSentence");
  const wordsPerRoundSelSentence = document.getElementById("wordsPerRoundSentence");
  const restartBtnSentence = document.getElementById("restartBtnSentence");
  const nextBtnSentence = document.getElementById("nextBtnSentence");

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
    scoreElSentence.textContent = String(score);
    mistakesElSentence.textContent = String(mistakes);

    const wordsPerRound = getWordsPerRound();
    const totalRounds = Math.ceil(sentence.length / wordsPerRound);
    const played = Math.floor(cursor / wordsPerRound) + (matchesLeft === 0 && currentSlice.length ? 1 : 0);
    const currentRound = Math.min(played || 1, totalRounds) || 0;

    progressElSentence.textContent = `Vòng ${currentRound}/${totalRounds}`;
  }

  function getWordsPerRound() {
    return parseInt(wordsPerRoundSelSentence.value, 10) || 5;
  }

  function setNotice(msg = "") {
    noticeElSentence.textContent = msg;
  }

  /*******************************
   * 4) VÒNG CHƠI
   *******************************/
  function buildOrderAndReset() {
    order = shuffle([...Array(sentence.length).keys()]); // [0..N-1] xáo trộn
    cursor = 0;
    score = 0;
    mistakes = 0;
    selectedChinese = null;
    selectedMean = null;
    nextBtnSentence.disabled = true;
    setNotice("");
    renderRound();
    updateStats();
  }

  function renderRound() {
    chineseListSentence.innerHTML = "";
    sentenceList.innerHTML = "";
    selectedChinese = null;
    selectedMean = null;
    nextBtnSentence.disabled = true;

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
      li.textContent = sentence[idx].chinese;
      li.dataset.idx = String(idx); // dùng index để đối chiếu
      li.classList.add("copy_word");
      li.addEventListener("click", onCopyCell);
      li.addEventListener("click", () => onSelectChinese(li));
      chineseListSentence.appendChild(li);
    }

    // Tạo danh sách pinyin (xáo trộn)
    const meanIndices = shuffle(currentSlice);
    for (const idx of meanIndices) {
      const li = document.createElement("li");
      li.textContent = sentence[idx].mean;
      li.dataset.idx = String(idx);
      li.addEventListener("click", () => onSelectMean(li));
      sentenceList.appendChild(li);
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
        nextBtnSentence.disabled = false;
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
  restartBtnSentence.addEventListener("click", buildOrderAndReset);
  nextBtnSentence.addEventListener("click", nextRound);

  // Đổi số từ mỗi vòng → restart để tính lại tổng vòng & thứ tự
  wordsPerRoundSelSentence.addEventListener("change", buildOrderAndReset);

  /*******************************
   * 6) KHỞI ĐỘNG
   *******************************/
  buildOrderAndReset();
}

function personNameGame() {

  /*******************************
   * 2) BIẾN TRẠNG THÁI personName PersonName
   *******************************/
  const chineseListPersonName = document.getElementById("chineseListPersonName");
  const personNameList = document.getElementById("personNameList");
  const scoreElPersonName = document.getElementById("scorePersonName");
  const mistakesElPersonName = document.getElementById("mistakesPersonName");
  const progressElPersonName = document.getElementById("progressPersonName");
  const noticeElPersonName = document.getElementById("noticePersonName");
  const wordsPerRoundSelPersonName = document.getElementById("wordsPerRoundPersonName");
  const restartBtnPersonName = document.getElementById("restartBtnPersonName");
  const nextBtnPersonName = document.getElementById("nextBtnPersonName");

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
    scoreElPersonName.textContent = String(score);
    mistakesElPersonName.textContent = String(mistakes);

    const wordsPerRound = getWordsPerRound();
    const totalRounds = Math.ceil(personNameData.length / wordsPerRound);
    const played = Math.floor(cursor / wordsPerRound) + (matchesLeft === 0 && currentSlice.length ? 1 : 0);
    const currentRound = Math.min(played || 1, totalRounds) || 0;

    progressElPersonName.textContent = `Vòng ${currentRound}/${totalRounds}`;
  }

  function getWordsPerRound() {
    return parseInt(wordsPerRoundSelPersonName.value, 10) || 5;
  }

  function setNotice(msg = "") {
    noticeElPersonName.textContent = msg;
  }

  /*******************************
   * 4) VÒNG CHƠI
   *******************************/
  function buildOrderAndReset() {
    order = shuffle([...Array(personNameData.length).keys()]); // [0..N-1] xáo trộn
    cursor = 0;
    score = 0;
    mistakes = 0;
    selectedChinese = null;
    selectedMean = null;
    nextBtnPersonName.disabled = true;
    setNotice("");
    renderRound();
    updateStats();
  }

  function renderRound() {
    chineseListPersonName.innerHTML = "";
    personNameList.innerHTML = "";
    selectedChinese = null;
    selectedMean = null;
    nextBtnPersonName.disabled = true;

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
      li.textContent = personNameData[idx].chinese;
      li.dataset.idx = String(idx); // dùng index để đối chiếu
      li.classList.add("copy_word");
      li.addEventListener("click", onCopyCell);
      li.addEventListener("click", () => onSelectChinese(li));
      chineseListPersonName.appendChild(li);
    }

    // Tạo danh sách pinyin (xáo trộn)
    const meanIndices = shuffle(currentSlice);
    for (const idx of meanIndices) {
      const li = document.createElement("li");
      li.textContent = personNameData[idx].mean;
      li.dataset.idx = String(idx);
      li.addEventListener("click", () => onSelectMean(li));
      personNameList.appendChild(li);
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
        nextBtnPersonName.disabled = false;
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
  restartBtnPersonName.addEventListener("click", buildOrderAndReset);
  nextBtnPersonName.addEventListener("click", nextRound);

  // Đổi số từ mỗi vòng → restart để tính lại tổng vòng & thứ tự
  wordsPerRoundSelPersonName.addEventListener("change", buildOrderAndReset);

  /*******************************
   * 6) KHỞI ĐỘNG
   *******************************/
  buildOrderAndReset();
}

// Option game personName PersonName

const showVocabularyGame = document.getElementById("showVocabularyGame");
const isVocabularyGame = document.getElementById("isVocabularyGame");

const showPronunciationGame = document.getElementById("showPronunciationGame");
const isPronunciationGame = document.getElementById("isPronunciationGame");

const showPinyiGame = document.getElementById("showPinyinGame");
const isPinyiGame = document.getElementById("isPinyinGame");

const showSentenceGame = document.getElementById("showSentenceGame");
const isSentenceGame = document.getElementById("isSentenceGame");

const showPersonNameGame = document.getElementById("showPersonNameGame");
const isPersonNameGame = document.getElementById("isPersonNameGame");

showVocabularyGame.onclick = function () {
  isVocabularyGame.style.display = "block";
  isPronunciationGame.style.display = "none";
  isPinyiGame.style.display = "none";
  isSentenceGame.style.display = "none";
  isPersonNameGame.style.display = "none";
  vocabularyGame();
}

showPronunciationGame.onclick = function () {
  isVocabularyGame.style.display = "none";
  isPronunciationGame.style.display = "block";
  isPinyiGame.style.display = "none";
  isSentenceGame.style.display = "none";
  isPersonNameGame.style.display = "none";
  pronunciatioGame();
}

showPinyiGame.onclick = function () {
  isVocabularyGame.style.display = "none";
  isPronunciationGame.style.display = "none";
  isPinyiGame.style.display = "block";
  isSentenceGame.style.display = "none";
  isPersonNameGame.style.display = "none";
  pinyinGame();
}

showSentenceGame.onclick = function () {
  isVocabularyGame.style.display = "none";
  isPronunciationGame.style.display = "none";
  isPinyiGame.style.display = "none";
  isSentenceGame.style.display = "block";
  isPersonNameGame.style.display = "none";
  sentenceGame();
}


showPersonNameGame.onclick = function () {
  isVocabularyGame.style.display = "none";
  isPronunciationGame.style.display = "none";
  isPinyiGame.style.display = "none";
  isSentenceGame.style.display = "none";
  isPersonNameGame.style.display = "block";
  personNameGame();
}




/*******************************
   * Mở danh sách từ vựng
   *******************************/
// Lấy phần tử
const modal = document.getElementById("vocabModal");
const btn = document.getElementById("showVocabularyBtn");
const span = document.querySelector(".close");
const vocabTableBody = document.getElementById("vocabTableBody");
const searchInputVocabulary = document.getElementById("searchInputVocabulary");
const showVocabulary = document.getElementById("showVocabulary");

vocabTableBody.addEventListener('click', onCopyCell);

// Hàm render bảng theo danh sách cho trước
function renderVocabulary(list) {
  const rows = list.map((word, index) => `
    <tr>
      <td>${word.index}</td>
      <td class="copy_word">${word.chinese}</td>
      <td>${word.mean}</td>
      <td>${word.pronunciation}</td>
      <td>${word.pinyin}</td>
    </tr>
  `).join(""); // nối thành 1 string duy nhất

  vocabTableBody.innerHTML = rows; // gán 1 lần
}

// Khi click nút -> mở popup và render tất cả
btn.onclick = function () {
  showVocabulary.style.display = "none";
  searchInputVocabulary.value = ""; // reset ô tìm kiếm
  renderVocabulary(vocabularyList);
  modal.style.display = "block";
}

// Khi gõ tìm kiếm -> lọc dữ liệu
searchInputVocabulary.addEventListener("input", function () {
  const keyword = this.value.toLowerCase().trim();
  const filtered = vocabularyList.filter(word =>
    word.chinese.includes(keyword) ||
    word.mean.toLowerCase().includes(keyword) ||
    word.pinyin.toLowerCase().includes(keyword) ||
    word.pronunciation.toLowerCase().includes(keyword)
  );
  renderVocabulary(filtered);
});

// Đóng popup
span.onclick = function () {
  modal.style.display = "none";
  showVocabulary.style.display = "block";
}

showVocabulary.onclick = function () {
  showVocabulary.style.display = "none";
  searchInputVocabulary.value = ""; // reset ô tìm kiếm
  renderVocabulary(vocabularyList);
  modal.style.display = "block";
}

window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
    showVocabulary.style.display = "block";
  }
}

const word = document.getElementById("word");
const showWordBtn = document.getElementById("showWordBtn");
const closeWordBtn = document.getElementById("closeWordBtn");

showWordBtn.onclick = function () {
  word.style.display = "block";
}

closeWordBtn.onclick = function () {
  word.style.display = "none";
}


const radical = document.getElementById("radical");
const showRadicalBtn = document.getElementById("showRadicalBtn");
const closeRadicalBtn = document.getElementById("closeRadicalBtn");
const radicalTableBody = document.getElementById("radicalTableBody");

// giả sử phần này chạy ngay sau khi DOM sẵn sàng:
radicalTableBody.addEventListener('click', onCopyCell);

showRadicalBtn.onclick = function () {
  radicalTableBody.innerHTML = ""; // clear bảng cũ
  radicalList.forEach((word, index) => {
    const row = `<tr>
      <td>${index + 1}</td>
      <td class="copy_word">${word.chinese}</td>
      <td>${word.mean}</td>
      <td>${word.sino_vietnamese}</td>
      <td>${word.pinyin}</td>
      <td>${word.pronunciation}</td>
    </tr>`;
    radicalTableBody.innerHTML += row;
  });
  radical.style.display = "block";
}

closeRadicalBtn.onclick = function () {
  radical.style.display = "none";
}

const grammar = document.getElementById("grammar");
const showGrammarBtn = document.getElementById("showGrammarBtn");
const closeGrammarBtn = document.getElementById("closeGrammarBtn");
const grammarTableBody = document.getElementById("grammarTableBody");

// giả sử phần này chạy ngay sau khi DOM sẵn sàng:
grammarTableBody.addEventListener('click', onCopyCell);

showGrammarBtn.onclick = function () {
  grammarTableBody.innerHTML = ""; // clear bảng cũ
  grammarList.forEach((word, index) => {
    const row = `<tr>
      <td>${index + 1}</td>
      <td class="copy_word">${word.name}</td>
      <td>${word.mean}</td>
      <td>${word.example1}</td>
      <td>${word.example2}</td>
      <td>${word.example3}</td>
    </tr>`;
    grammarTableBody.innerHTML += row;
  });
  grammar.style.display = "block";
}

closeGrammarBtn.onclick = function () {
  grammar.style.display = "none";
}


const personName = document.getElementById("personName");
const showPersonNameBtn = document.getElementById("showPersonNameBtn");
const closePersonNameBtn = document.getElementById("closePersonNameBtn");
const personNameTableBody = document.getElementById("personNameTableBody");
const searchPersonName = document.getElementById("searchPersonName");

// Gắn sự kiện copy
personNameTableBody.addEventListener('click', onCopyCell);

// Hàm render bảng
function renderPersonName(list) {
  personNameTableBody.innerHTML = "";
  list.forEach((word, index) => {
    const row = `<tr>
      <td>${index + 1}</td>
      <td class="copy_word">${word.chinese}</td>
      <td>${word.mean}</td>
      <td>${word.pronunciation}</td>
      <td>${word.pinyin}</td>
    </tr>`;
    personNameTableBody.innerHTML += row;
  });
}

// Khi mở popup -> render toàn bộ
showPersonNameBtn.onclick = function () {
  searchPersonName.value = ""; // reset ô tìm kiếm
  renderPersonName(personNameData);
  personName.style.display = "block";
}

// Khi gõ tìm kiếm -> lọc dữ liệu
searchPersonName.addEventListener("input", function () {
  const keyword = this.value.toLowerCase().trim();
  const filtered = personNameData.filter(word =>
    word.chinese.includes(keyword) ||
    word.mean.toLowerCase().includes(keyword) ||
    word.pinyin.toLowerCase().includes(keyword) ||
    word.pronunciation.toLowerCase().includes(keyword)
  );
  renderPersonName(filtered);
});

// Đóng popup
closePersonNameBtn.onclick = function () {
  personName.style.display = "none";
}






