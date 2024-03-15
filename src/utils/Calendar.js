export default class Calendar {
  constructor(year = 1970, month = 1, mode = 'mondayFirst') {
    this.year = null;
    this.month = null;
    // 日历框（显示出来的一页）共6行，每行7天，索引从0开始
    this.daysInWeekOfMonth = null; // 6 * 7 的二维数组

    switch (mode) {
      case 'mondayFirst':
        Calendar.BASE_YEAR.firstDayIndex = 3;
        break;
      case 'sundayFirst':
        Calendar.BASE_YEAR.firstDayIndex = 4;
        break;
      default:
        Calendar.BASE_YEAR.firstDayIndex = 3;
    }

    this.setCalendar(year, month);
  }

  static BASE_YEAR = {
    year: 1970,
    firstDayIndex: undefined,
  };

  static LITTLE_MONTH = [4, 6, 9, 11];

  static BIG_MONTH = [1, 3, 5, 7, 8, 10, 12];

  static ZH_DAY_MAP = {
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    0: '日',
  };

  static getNowDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return {
      year,
      month,
      date,
      day,
      hours,
      minutes,
    };
  };

  static getDay(y, m, d) {
    const date = new Date(y, m - 1, d);
    const day = date.getDay();
    const dayZh = Calendar.ZH_DAY_MAP[day];
    return { day, dayZh };
  }

  /* 闰年判断 */
  isLeapYear(year) {
    if (year % 4 !== 0) return false;
    if (year % 100 !== 0) return true;
    if (year % 400 !== 0) return false;
    return true;
  }

  /* 一个月的最后一天 */
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

  /* 一年的第一天（一月份）在日历框里的索引 */
  getFirstDayIndexOfYear(year) {
    let leapYearsCount = 0;
    for (let y = Calendar.BASE_YEAR.year; y < year; y++) {
      if (this.isLeapYear(y)) {
        leapYearsCount++;
      }
    }

    const passedYears = year - Calendar.BASE_YEAR.year;
    const passedDays = 365 * passedYears + leapYearsCount;
    const firstDayIndexOfYear =
      (passedDays + Calendar.BASE_YEAR.firstDayIndex) % 7;

    return firstDayIndexOfYear;
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

  getPreviousMonth(year, month) {
    if (month === 1) {
      return {
        year: year - 1,
        month: 12,
      };
    } else {
      return {
        year,
        month: month - 1,
      };
    }
  }

  getNextMonth(year, month) {
    if (month === 12) {
      return {
        year: year + 1,
        month: 1,
      };
    } else {
      return {
        year,
        month: month + 1,
      };
    }
  }

  /* 设置日历，得到daysInWeekOfMonth用于显示 */
  setCalendar(year, month) {
    this.year = year;
    this.month = month;
    const firstDayIndexOfMonth = this.getFirstDayIndexOfMonth(year, month);
    const previousMonth = this.getPreviousMonth(year, month);
    const lastDayOfPreviousMonth = this.getLastDayOfMonth(
      previousMonth.year,
      previousMonth.month
    );
    const lastDayOfMonth = this.getLastDayOfMonth(year, month);

    const daysOfMonth = [];
    for (let i = 1; i <= 42; i++) {
      if (i <= firstDayIndexOfMonth) {
        const date = lastDayOfPreviousMonth - firstDayIndexOfMonth + i;
        const month = previousMonth.month;
        const year = previousMonth.year;
        daysOfMonth.push({ date, month, year });
      } else if (
        i > firstDayIndexOfMonth &&
        i - firstDayIndexOfMonth <= lastDayOfMonth
      ) {
        const date = i - firstDayIndexOfMonth;
        daysOfMonth.push({ date, month, year });
      } else {
        const date = i - firstDayIndexOfMonth - lastDayOfMonth;
        const nextMonth = this.getNextMonth(year, month);
        daysOfMonth.push({
          date,
          month: nextMonth.month,
          year: nextMonth.year,
        });
      }
    }

    const daysInWeekOfMonth = [];
    for (let i = 0; i < 6; i++) {
      daysInWeekOfMonth.push(daysOfMonth.slice(i * 7, (i + 1) * 7));
    }
    this.daysInWeekOfMonth = daysInWeekOfMonth;
  }

  /* 翻到上一个月 */
  decreaseMonth() {
    const { year, month } = this.getPreviousMonth(this.year, this.month);
    this.setCalendar(year, month);
  }

  /* 翻到下一个月 */
  increaseMonth() {
    const { year, month } = this.getNextMonth(this.year, this.month);
    this.setCalendar(year, month);
  }
}
