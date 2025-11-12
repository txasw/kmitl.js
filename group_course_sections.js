(() => {
  const mainContainer = document.querySelector(".v-main__wrap .container");
  if (!mainContainer) return;

  function extractAllSubjects() {
    return Array.from(mainContainer.querySelectorAll("table tbody tr"))
      .map((tr) => {
        const tds = tr.querySelectorAll("td");
        if (tds.length < 9) return null;
        return {
          code: tds[0]?.innerText.trim(),
          name: tds[1]?.innerText.trim(),
          credit: tds[2]?.innerText.trim(),
          section: tds[3]?.innerText.trim().split("\n")[0].trim(),
          type: tds[3]?.innerText.trim().split("\n")[1].trim(),
          time: tds[4]?.innerText.trim(),
          room: tds[5]?.innerText.trim(),
          building: tds[6]?.innerText.trim(),
          teacher: tds[7]?.innerText.trim().split("\n").map(t => t.trim()),
          exam: {
            midterm: {
              raw: tds[8]?.innerText.trim().split("\nFinal")[0].trim(),
              date: tds[8]?.innerText.trim().split("\nFinal")[0].split("\n")[1]?.trim(),
              time: tds[8]?.innerText.trim().split("\nFinal")[0].split("\n")[2]?.trim(),
            },
            final: {
              raw: "Final" + tds[8]?.innerText.trim().split("\nFinal")[1].trim(),
              date: tds[8]?.innerText.trim().split("\nFinal")[1].split("\n")[1]?.trim(),
              time: tds[8]?.innerText.trim().split("\nFinal")[1].split("\n")[2]?.trim(),
            },
          },
          conditionButton: tds[9]?.querySelector("button"),
          note: tds[10]?.innerText.trim(),
        };
      })
      .filter((data) => data?.code);
  }

  function groupSubjects(rows) {
    const map = rows.reduce((acc, r) => {
      if (!acc[r.code]) {
        acc[r.code] = { name: r.name, credit: r.credit, sections: [] };
      }
      const key = `${r.section}-${r.time}-${r.room}`;
      if (!acc[r.code].sections.some((s) => s.key === key)) {
        acc[r.code].sections.push({ ...r, key });
      }
      return acc;
    }, {});

    Object.values(map).forEach((subj) => {
      subj.sections.sort((a, b) => {
        const numA = parseInt(a.section.match(/\d+/)?.[0] || 0);
        const numB = parseInt(b.section.match(/\d+/)?.[0] || 0);
        return numA - numB;
      });
    });
    return map;
  }

  function renderList(grouped) {
    mainContainer.innerHTML = "";
    const container = mainContainer.appendChild(document.createElement("div"));
    container.style.padding = "20px 30px";

    const title = container.appendChild(document.createElement("h2"));
    title.textContent = "รายวิชาทั้งหมด";
    title.style.cssText = "color:#e65100; margin-bottom:25px; font-weight:600;";

    Object.entries(grouped).forEach(([code, subject]) => {
      const card = container.appendChild(document.createElement("div"));
      card.style.cssText =
        "background:white; border-radius:10px; box-shadow:0 1px 4px rgba(0,0,0,0.1); margin-bottom:20px; padding:20px;";

      card.innerHTML = `
        <div style="font-size:17px; font-weight:600; color:#ef6c00;">
          ${code} - ${subject.name}
        </div>
        <div style="color:#555; font-size:13px; margin-top:2px;">หน่วยกิต ${subject.credit}</div>
      `;

      const sectionList = card.appendChild(document.createElement("div"));
      sectionList.style.marginTop = "12px";

      subject.sections.forEach((sec) => {
        const wrapper = sectionList.appendChild(document.createElement("div"));
        wrapper.style.margin = "8px 0";

        const headerRow = wrapper.appendChild(document.createElement("div"));
        headerRow.style.cssText =
          "background:#fff8f3; border-left:4px solid #ef6c00; border-radius:6px; padding:10px 12px; font-size:14px; cursor:pointer; display:flex; justify-content:space-between; align-items:center;";
        headerRow.innerHTML = `
          <div><b>Section ${sec.section}</b> | ${sec.time} | ${sec.room} (${sec.building ? sec.building : "ไม่ระบุ"})</div>
          <span style="color:#ef6c00; font-weight:bold;">+</span>
        `;

        const detail = wrapper.appendChild(document.createElement("div"));
        detail.style.cssText =
          "display:none; margin-left:10px; margin-top:8px; padding:8px 10px; background:#fffaf7; border-left:2px dashed #ef6c00; border-radius:4px; font-size:13.5px; color:#444; line-height:1.7;";

        detail.appendChild(
          document.createElement("div")
        ).innerHTML = `<b>${sec.teacher.join(", ")}</b>`;
        detail.appendChild(
          document.createElement("div")
        ).innerHTML = `<b>สอบกลางภาค</b> <span style="color:#555;">${sec.exam.midterm.date} ${sec.exam.midterm.time ? sec.exam.midterm.time : ""}</span>`;
        detail.appendChild(
          document.createElement("div")
        ).innerHTML = `<b>สอบปลายภาค</b> <span style="color:#555;">${sec.exam.final.date} ${sec.exam.final.time ? sec.exam.final.time : ""}</span>`;

        if (sec.conditionButton) {
          const line = detail.appendChild(document.createElement("div"));
          line.style.cssText =
            "display: flex; align-items: center; margin-top: 4px;";
          const label = line.appendChild(document.createElement("b"));
          label.textContent = "เงื่อนไข:";
          label.style.marginRight = "5px";
          line.appendChild(sec.conditionButton);
        }

        if (sec.note) {
          const noteLine = detail.appendChild(document.createElement("div"));
          noteLine.style.marginTop = "4px";
          noteLine.innerHTML = `<b>หมายเหตุ:</b> ${sec.note}`;
        }

        headerRow.addEventListener("click", () => {
          const isHidden = detail.style.display === "none";
          detail.style.display = isHidden ? "block" : "none";
          headerRow.querySelector("span").textContent = isHidden ? "-" : "+";
        });
      });
    });
  }

  const data = extractAllSubjects();
  const grouped = groupSubjects(data);
  renderList(grouped);
})();
