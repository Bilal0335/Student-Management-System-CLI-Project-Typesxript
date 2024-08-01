import inquirer from "inquirer";
import chalk from "chalk";

// Helper function to convert string to Title Case
function toTitleCase(sentence: string): string {
  return sentence.replace(/\b\w/g, (c) => c.toUpperCase());
}

// Class to represent a student
class Student {
  static counter = Math.floor(10000 + Math.random() * 90000);
  id: number;
  name: string;
  age: number;
  gradeLevel: string;
  courses: string[];
  balance: number;

  constructor(name: string, age: number, gradeLevel: string) {
    this.id = Student.counter++;
    this.name = name;
    this.age = age;
    this.gradeLevel = gradeLevel;
    this.courses = [];
    this.balance = 0;
  }

  enrollCourse(course: string) {
    this.courses.push(course);
  }

  viewBalance() {
    console.log(chalk.bold("-".repeat(60)));
    console.log(
      chalk.bold.white(
        `Balance for ${this.name}: $ ${chalk.bold.greenBright(this.balance)}`
      )
    );
    console.log(chalk.bold("-".repeat(60)));
  }

  payTuition(amount: number) {
    if (this.balance >= amount) {
      this.balance -= amount;
      console.log(
        `$ ${chalk.bold.greenBright(amount)} has been paid by ${chalk.bold(
          this.name
        )}.`
      );
      console.log(`Remaining balance: $ ${chalk.bold.green(this.balance)}`);
    } else {
      console.log(`Insufficient balance`);
    }
  }

  showStatus() {
    console.log(chalk.bold("-".repeat(60)));
    console.log(chalk.bold.blue(`\t\t Student Status`));
    console.log(chalk.bold("-".repeat(60)));
    console.log(chalk.bold.white(`  ID:  ${chalk.yellow(this.id)}`));
    console.log(
      chalk.bold.white(`  Name:  ${chalk.bold.magentaBright(this.name)}`)
    );
    console.log(
      chalk.bold.white(`  Age:  ${chalk.bold.magentaBright(this.age)} year`)
    );
    console.log(
      chalk.bold.white(
        `  Grade Level:  ${chalk.bold.magentaBright(this.gradeLevel)}`
      )
    );
    console.log(
      chalk.bold.white(`  Balance:  $ ${chalk.bold.greenBright(this.balance)}`)
    );
    console.log(
      chalk.bold.white(
        `  Enrolled courses:  [${chalk.bold.cyanBright(
          this.courses.join(", ")
        )}]`
      )
    );
    console.log(chalk.bold("-".repeat(60)));
  }
}

// Class to manage the collection of students
class StudentManager {
  students: Student[];

  constructor() {
    this.students = [];
  }

  addStudent(name: string, age: number, gradeLevel: string) {
    const toTitleCaseName = toTitleCase(name);
    const student = new Student(toTitleCaseName, age, gradeLevel);
    this.students.push(student);
    console.log(chalk.bold("-".repeat(60)));
    console.log(
      `'${chalk.bold.blueBright(
        toTitleCaseName
      )}' added successfully. Student ID: ${chalk.greenBright(student.id)}`
    );
    console.log(chalk.bold("-".repeat(60)));
  }

  removeStudent(studentId: number) {
    const index = this.students.findIndex(
      (student) => student.id === studentId
    );
    if (index !== -1) {
      const removedStudent = this.students.splice(index, 1)[0];
      console.log(chalk.bold("-".repeat(60)));
      console.log(
        `'${chalk.bold.blueBright(
          removedStudent.name
        )}' with ID ${chalk.greenBright(removedStudent.id)} has been removed.`
      );
      console.log(chalk.bold("-".repeat(60)));
    } else {
      console.log(chalk.red(`Student with ID: ${studentId} not found.`));
    }
  }

  enrollStudent(studentId: number, courses: string[]) {
    const student = this.findStudent(studentId);
    if (student) {
      courses.forEach((course) => student.enrollCourse(course));
      console.log(chalk.bold("-".repeat(60)));
      console.log(
        `'${chalk.bold(
          student.name
        )}' enrolled in courses: ${chalk.bold.blueBright(courses.join(", "))}`
      );
      console.log(chalk.bold("-".repeat(60)));
      const totalFees = getFees(courses);
      student.balance += totalFees; // Accumulate fees for the student
      console.log(
        chalk.yellowBright.bold("\nTotal Fees for Selected Courses:")
      );
      console.log(chalk.green(`RS ${totalFees}`));
    } else {
      console.log(chalk.red(`Student with ID: ${studentId} not found.`));
    }
  }

  viewStudentBalance(studentId: number) {
    const student = this.findStudent(studentId);
    if (student) {
      student.viewBalance();
    } else {
      console.log(chalk.red(`Student with ID: ${studentId} not found.`));
    }
  }

  payStudentTuition(studentId: number, amount: number) {
    const student = this.findStudent(studentId);
    if (student) {
      student.payTuition(amount);
    } else {
      console.log(chalk.red(`Student with ID: ${studentId} not found.`));
    }
  }

  showStudentStatus(studentId: number) {
    const student = this.findStudent(studentId);
    if (student) {
      student.showStatus();
    } else {
      console.log(chalk.redBright(`Student with ID: ${studentId} not found.`));
    }
  }

  public findStudent(studentId: number): Student | undefined {
    return this.students.find((student) => student.id === studentId);
  }
}

// Main function to run the program
async function main() {
  console.log(chalk.yellowBright.bold("=".repeat(60)));
  console.log(
    chalk.yellowBright.bold(
      "        **BilalCode - Student Management System**          "
    )
  );
  console.log(chalk.yellowBright.bold("=".repeat(60)));

  const studentManager = new StudentManager();

  while (true) {
    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: chalk.bold.yellowBright("Choose an option:"),
        choices: [
          "Add Student",
          "Enroll Student",
          "View Student Balance",
          "Pay Student Fees",
          "Show Student Status",
          "Remove Student",
          "Exit",
        ],
      },
    ]);

    switch (choice) {
      case "Add Student":
        const studentDetails = await inquirer.prompt([
          {
            type: "input",
            name: "name",
            message: "Enter student name:",
          },
          {
            type: "input",
            name: "age",
            message: "Enter student age:",
          },
        ]);

        let gradeLevelChoices: string[] = [];
        const age = parseInt(studentDetails.age);

        if (isNaN(age)) {
          console.log(chalk.red("Invalid age entered. Please try again."));
          break;
        }

        if (age <= 15) {
          gradeLevelChoices = ["7th Grade", "8th Grade", "9th Grade"];
        } else if (age > 15 && age <= 20) {
          gradeLevelChoices = ["Matriculation", "Intermediate"];
        } else {
          gradeLevelChoices = ["Undergraduate Student"];
        }

        const gradeLevel = await inquirer.prompt([
          {
            name: "gradeLevel",
            type: "list",
            message: chalk.cyan("Select the student's grade level:"),
            choices: gradeLevelChoices,
          },
        ]);

        studentManager.addStudent(
          studentDetails.name,
          age,
          gradeLevel.gradeLevel
        );
        break;

      case "Enroll Student":
        const enrollmentDetails = await inquirer.prompt([
          {
            type: "input",
            name: "studentId",
            message: "Enter student ID:",
          },
        ]);

        const studentId = parseInt(enrollmentDetails.studentId);

        if (isNaN(studentId)) {
          console.log(
            chalk.red("Invalid student ID entered. Please try again.")
          );
          break;
        }

        const student = studentManager.findStudent(studentId);

        if (student) {
          const courses = await inquirer.prompt([
            {
              name: "selectedCourses",
              type: "checkbox",
              message: chalk.cyan("Select preferred courses:"),
              choices: getCourseChoices(student.gradeLevel),
              validate: function (selectedCourses: string[]) {
                return selectedCourses.length > 0
                  ? true
                  : chalk.red("Please select at least one course.");
              },
            },
          ]);

          studentManager.enrollStudent(studentId, courses.selectedCourses);
        } else {
          console.log(chalk.red(`Student with ID: ${studentId} not found.`));
        }
        break;

      case "View Student Balance":
        const viewBalanceInput = await inquirer.prompt([
          {
            type: "input",
            name: "studentId",
            message: "Enter student ID:",
          },
        ]);

        const viewBalanceId = parseInt(viewBalanceInput.studentId);

        if (isNaN(viewBalanceId)) {
          console.log(
            chalk.red("Invalid student ID entered. Please try again.")
          );
          break;
        }

        studentManager.viewStudentBalance(viewBalanceId);
        break;

      case "Pay Student Fees":
        const paymentInput = await inquirer.prompt([
          {
            type: "input",
            name: "studentId",
            message: "Enter student ID:",
          },
          {
            type: "input",
            name: "amount",
            message: "Enter amount to pay:",
          },
        ]);

        const paymentStudentId = parseInt(paymentInput.studentId);
        const amount = parseInt(paymentInput.amount);

        if (isNaN(paymentStudentId) || isNaN(amount)) {
          console.log(chalk.red("Invalid input entered. Please try again."));
          break;
        }

        studentManager.payStudentTuition(paymentStudentId, amount);
        break;

      case "Show Student Status":
        const statusInput = await inquirer.prompt([
          {
            type: "input",
            name: "studentId",
            message: "Enter Student ID:",
          },
        ]);

        const statusStudentId = parseInt(statusInput.studentId);

        if (isNaN(statusStudentId)) {
          console.log(
            chalk.red("Invalid student ID entered. Please try again.")
          );
          break;
        }

        studentManager.showStudentStatus(statusStudentId);
        break;

      case "Remove Student":
        const removeInput = await inquirer.prompt([
          {
            type: "input",
            name: "studentId",
            message: "Enter student ID to remove:",
          },
        ]);
        const removeStudentId = parseInt(removeInput.studentId);
        if (!isNaN(removeStudentId)) {
          studentManager.removeStudent(removeStudentId);
        } else {
          console.log(
            chalk.red("Invalid student ID entered. Please try again.")
          );
        }
        break;

      case "Exit":
        console.log(chalk.red("Exiting..."));
        process.exit();
    }
  }
}

// Function to get available courses based on grade level
function getCourseChoices(gradeLevel: string) {
  switch (gradeLevel) {
    case "7th Grade":
    case "8th Grade":
    case "9th Grade":
      return [
        "Mathematics",
        "Pakistan Studies",
        "English",
        "Science",
        "Islamiat",
      ];
    case "Matriculation":
    case "Intermediate":
      return [
        "Intermediate Math",
        "Chemistry",
        "Physics",
        "History",
        "Functional English",
      ];
    case "Undergraduate Student":
      return ["Python Programming", "C++", "SQL", "Java", "React.js"];
    default:
      return ["Default Course 1", "Default Course 2", "Default Course 3"];
  }
}

// Function to calculate fees based on selected courses
function getFees(courseChoices: string[]) {
  let fees = 0;
  for (const course of courseChoices) {
    switch (course) {
      case "Mathematics":
      case "Pakistan Studies":
      case "English":
      case "Science":
      case "Islamiat":
        fees += 10000;
        break;
      case "Intermediate Math":
      case "Chemistry":
      case "Physics":
      case "History":
      case "Functional English":
        fees += 15000;
        break;
      case "Python Programming":
      case "C++":
      case "SQL":
      case "Java":
      case "React.js":
        fees += 20000;
        break;
      default:
        fees += 0;
    }
  }
  return fees;
}

//! Start the program
main();
