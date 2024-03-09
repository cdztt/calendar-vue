export default class Calendar {
  constructor(year = 1970, month = 1, date = 1) {
    this.year = year;
    this.month = month;
    this.date = date;
    this.daysOfMonth = null;
    this.daysInWeekOfMonth = null;
    this.startDayIndexOfCurrentMonth = null;
    this.endDayIndexOfCurrentMonth = null;
    this.currentDayIndex = null;
    this.currentDayInWeek = null;
    this.setDay(year, month, date);
  }

  static LITTLE_MONTH = [4, 6, 9, 11];
  static BIG_MONTH = [1, 3, 5, 7, 8, 10, 12];
  static dayMapping = {
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    7: '日',
  };
  static getNowDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const day = now.getDay();
    const dayZh = Calendar.dayMapping[day];
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return {
      dateDay: `${month}月${date}日, 星期${dayZh}`,
      year,
      month,
      date,
      dayZh,
      hours,
      minutes,
    };
  };

  isLeapYear(year) {
    if (year % 4 !== 0) return false;
    if (year % 100 !== 0) return true;
    if (year % 400 !== 0) return false;
    return true;
  }

  /* 一年的第一天在日历框（共6行，每行7天，共42天，索引从0开始）里的索引 */
  getFirstDayIndexOfYear(year) {
    const BASE_YEAR = {
      year: 1970,
      firstDayIndex: 3,
    };

    let leapYearsCount = 0;
    for (let y = BASE_YEAR.year; y < year; y++) {
      if (this.isLeapYear(y)) {
        leapYearsCount++;
      }
    }

    const passedYears = year - BASE_YEAR.year;
    const passedDays = 365 * passedYears + leapYearsCount;
    const firstDayIndexOfYear = (passedDays + BASE_YEAR.firstDayIndex) % 7;

    return firstDayIndexOfYear;
  }

  getLastDayOfMonth(year, month) {
    let lastDay;

    if (Calendar.LITTLE_MONTH.includes(month)) {
      lastDay = 30;
    } else if (Calendar.BIG_MONTH.includes(month)) {
      lastDay = 31;
    } else if (month === 2 && !this.isLeapYear(year)) {
      lastDay = 28;
    } else {
      lastDay = 29;
    }

    return lastDay;
  }

  /* 一个月的第一天在日历框里的索引 */
  getFirstDayIndexOfMonth(year, month) {
    const firstDayIndexOfYear = this.getFirstDayIndexOfYear(year);

    let passedDays = 0;
    for (let m = 1; m < month; m++) {
      passedDays += this.getLastDayOfMonth(year, m);
    }
    const firstDayIndexOfMonth = (passedDays + firstDayIndexOfYear) % 7;

    return firstDayIndexOfMonth;
  }

  getPreviousMonth(month = this.month) {
    return month === 1 ? 12 : month - 1;
  }

  getNextMonth(month = this.month) {
    return month === 12 ? 1 : month + 1;
  }

  setDay(year, month, date) {
    const firstDayIndexOfMonth = this.getFirstDayIndexOfMonth(year, month);
    const lastDayOfPreviousMonth = this.getLastDayOfMonth(
      year,
      this.getPreviousMonth(month)
    );
    const lastDayOfMonth = this.getLastDayOfMonth(year, month);

    const daysOfMonth = [];
    for (let i = 1; i <= 42; i++) {
      if (i <= firstDayIndexOfMonth) {
        daysOfMonth.push(lastDayOfPreviousMonth - firstDayIndexOfMonth + i);
      } else if (
        i > firstDayIndexOfMonth &&
        i - firstDayIndexOfMonth <= lastDayOfMonth
      ) {
        daysOfMonth.push(i - firstDayIndexOfMonth);
      } else {
        daysOfMonth.push(i - firstDayIndexOfMonth - lastDayOfMonth);
      }
    }

    const daysInWeekOfMonth = [];
    for (let i = 0; i < 6; i++) {
      daysInWeekOfMonth.push(daysOfMonth.slice(i * 7, (i + 1) * 7));
    }

    this.daysOfMonth = daysOfMonth;
    this.daysInWeekOfMonth = daysInWeekOfMonth;
    this.startDayIndexOfCurrentMonth = firstDayIndexOfMonth + 1;
    this.endDayIndexOfCurrentMonth = firstDayIndexOfMonth + lastDayOfMonth;
    this.currentDayIndex = firstDayIndexOfMonth + date;
    this.currentDayInWeek = Calendar.dayMapping[(this.currentDayIndex % 7) + 1];
  }

  decreaseMonth() {
    this.month = this.getPreviousMonth();
    if (this.month === 12) {
      this.year -= 1;
    }
    this.setDay(this.year, this.month, this.date);
  }

  increaseMonth() {
    this.month = this.getNextMonth();
    if (this.month === 1) {
      this.year += 1;
    }
    this.setDay(this.year, this.month, this.date);
  }
}
