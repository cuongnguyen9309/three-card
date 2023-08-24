Report:

Chức năng:
	_Fetch Deck: Tạo một deck mới. Chạy một lần khi vừa load game.
	_Shuffle Deck: Trộn bài.
	_Reset: Trộn bài và reset coins
	_Draw Cards: Lấy bài từ deck chia cho tất cả người chơi.Cập nhật số lá bài trong deck. Nếu không đủ thì báo lỗi và shuffle lại.
	_Calculate point: Tính tổng điểm các lá bài
	_Card to point: Chuyển từ value sang point (ex: “J”->10)
	_Reveal: Lật bài.Tính và so sánh điểm để xác định người thắng và thua. Trừ coins người thua. Báo kết quả.
	_Remove out of coins player: loại người chơi hết coins ra khỏi table.(Không hiển thị cards và không chia bài.)

Các state cần có:
	_Deck{deck_id,remaining}
	_Players{playerName:{points,cards,coins}}
	_ValidPlayers[...playerNames…] : Lưu tên những người chơi còn coins để không phải check coins từng người mỗi lần chia bài, tính điểm.
	_isLoading: có đang call API hay không
	_isReveal: có đang lật bài hay không
	_isDrawn: đã chia bài chưa, nếu chia rồi thì phải lật bài rồi mới được chia tiếp.

UI:
	_PlayerHand: Hiển thị player name, coins, points và cards.
	_Deck Cards: Hiển thị số lá bài trong deck.
	_Loading: Báo đang call API.
	_Buttons:Shuffle, Draw, Reveal, Reset.
		+Disable Reveal khi chưa draw
		+Disable Draw khi chưa reveal
		+Disable tất cả buttons khi đang loading.

Code: https://codesandbox.io/p/sandbox/three-card-pgdqv9
Shuffle rồi draw để chơi.
