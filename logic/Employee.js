const ranks = {
  "LG": 1,
  "MG": 2,
  "BG": 3,
  "COL": 4,
  "SLTC": 5,
  "LTC": 6,
  "MAJ": 7,
  "CPT": 8,
  "LTA": 9,
  "2LT": 10,
  "DX": 30,
  "CWO": 31,
  "SWO": 32,
  "MWO": 33,
  "1WO": 34,
  "2WO": 35,
  "3WO": 36,
  "MSG": 37,
  "SSG": 38,
  "1SG": 39,
  "2SG": 40,
  "3SG": 41,
  "CFC": 42,
  "CPL": 43,
  "LCP": 44,
  "PTE": 45,
  "REC": 46
};

const rankToInt = rank => {
  if (rank.toUpperCase().includes('DX')) {
    let suffix = Number(rank.substring(2));
    return 30 - suffix;
  }
  return ranks[rank];
}

const Employee = {
  fromString(string) {
    try {
      let tokens = string.split(',');
      let rank = tokens[0].trim().toUpperCase();
      let rankInt = rankToInt(rank);
      let name = tokens[1].trim().toUpperCase();
      let department = tokens[2].trim().toUpperCase();
      let status = 0;
      let employee = {
        rank, rankInt, name, department, status
      }
      return employee;
    } catch(e) {
      console.log(e);
      return null;
    }
  },
  toList(string) {
    let lines = string.trim().split(/\r?\n/);
    let list = [];
    for (let row of lines) {
      let employee = this.fromString(row);
      if(employee) list.push(employee);
    }
    return list;
  }
}

export default Employee;