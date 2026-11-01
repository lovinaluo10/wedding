/**
 * 圓山喜帖 RSVP → Google Sheets
 *
 * 試算表網址類似：
 * https://docs.google.com/spreadsheets/d/這一段就是ID/edit
 * 把 ID 貼進下面的引號。即使 Apps Script 不是從試算表開啟，也能寫入。
 */
const SPREADSHEET_ID = "";

function getSheet() {
  const ss = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error("找不到試算表。請填上 SPREADSHEET_ID。");
  }
  return ss.getSheets()[0];
}

function doPost(e) {
  const sheet = getSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.submittedAt || new Date(),
    data.name || "",
    data.phone || "",
    data.attendance || "",
    data.ceremony || "",
    data.ceremonyCount || "",
    data.guestCount || "",
    data.vegCount || "",
    data.kidsChair || "",
    data.paperInvite || "",
    data.address || "",
    data.blessing || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: "wedding-rsvp" }))
    .setMimeType(ContentService.MimeType.JSON);
}
