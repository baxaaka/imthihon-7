class History {
  id;
  user;
  book;
  count;
  status;
  date;
  isDeleted;
  constructor(id, name, user, book, count, date, isDeleted = false) {
    this.id = id;
    this.name=name;
    this.user = user;
    this.book = book;
    this.count = count;
    this.date = date;
    this.isDelete = isDeleted;
  }
}
