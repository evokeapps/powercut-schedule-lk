(function (m, moment) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var m__default = /*#__PURE__*/_interopDefaultLegacy(m);
  var moment__default = /*#__PURE__*/_interopDefaultLegacy(moment);

  class ScheduleCard {
    oninit() {
      this.expanded = false;
    }
    view(vnode) {
      const item = vnode.attrs.item;
      return m__default["default"](
        "div.p-3.mb-3.border",
        {
          onclick: (e) => {
            this.expanded = !this.expanded;
          },
        },
        [
          m__default["default"]("div.fw-bold.d-flex.justify-content-between.align-items-center", [
            m__default["default"]("span.fs-5", item.area),
            m__default["default"](
              "span",
              m__default["default"](
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "16",
                  height: "16",
                  fill: "#3d3d3d",
                  viewBox: "0 0 16 16",
                },
                this.expanded
                  ? m__default["default"]("path", {
                      "fill-rule": "evenodd",
                      d: "M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z",
                    })
                  : m__default["default"]("path", {
                      "fill-rule": "evenodd",
                      d: "M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z",
                    })
              )
            ),
          ]),
          item.times.map((time) => {
            return m__default["default"]("div.fs-5", `From ${time["start"]} to ${time["end"]}`);
          }),
          this.expanded
            ? m__default["default"](
                "div.text-muted.mt-2",
                {
                  style: {
                    fontSize: "0.75em",
                  },
                },
                item.areas
              )
            : null,
        ]
      );
    }
  }

  class Home {
    oninit() {
      this.schedule = [];
      this.error = null;
      this.all = [];
      this.date = moment__default["default"]().format("YYYY-MM-DD");
      this.loading = false;
    }
    oncreate() {
      this.updateSchedule();
    }
    updateSchedule() {
      this.loading = true;
      m__default["default"].redraw();
      m__default["default"].request(
        `https://powercut-schedule-lk.vercel.app/schedule?date=${this.date}`
      )
        .then((res) => {
          if (res["error"]) {
            throw Error(res["payload"]);
          } else {
            this.all = res["data"]["payload"];
            this.schedule = this.all;
          }
        })
        .catch((error) => {
          this.error = error;
        })
        .finally(() => {
          this.loading = false;
          m__default["default"].redraw();
        });
    }
    view() {
      return [
        m__default["default"](
          "nav.navbar.navbar-dark.bg-dark.bg-gradient",
          m__default["default"]("div.container", [
            m__default["default"]("a.navbar-brand.fw-bold", "Power Cut Schedule - Sri Lanka"),
          ])
        ),
        m__default["default"]("div.container.pt-3", [
          this.loading
            ? m__default["default"]("div.row", m__default["default"]("div.col.py-3.text-center", m__default["default"]("div.spinner-border")))
            : null,
          this.error != null && !this.loading
            ? m__default["default"]("div.row", m__default["default"]("div.col", m__default["default"]("div.p-3", this.error)))
            : null,
          !this.loading
            ? m__default["default"]("div.row.row-cols-1.row-cols-md-2", [
                m__default["default"](
                  "div.col",
                  m__default["default"]("input.form-control.mb-3", {
                    placeholder: "Search by area",
                    oninput: (e) => {
                      const query = e.target.value;
                      if (query.length) {
                        console.log(query);
                        this.schedule = this.all.filter((item) => {
                          return item["areas"].toLowerCase().search(query) != -1;
                        });
                      } else {
                        this.schedule = this.all;
                      }
                    },
                  })
                ),
                m__default["default"](
                  "div.col",
                  m__default["default"]("input.form-control.mb-3", {
                    placeholder: "Search by area",
                    type: "date",
                    value: this.date,
                    onchange: (e) => {
                      this.date = moment__default["default"](e.target.value).format("YYYY-MM-DD");
                      this.updateSchedule();
                    },
                  })
                ),
              ])
            : null,
          !this.all.length && !this.loading
            ? m__default["default"](
                "div.row.my-5",
                m__default["default"](
                  "div.col.text-center.p-3.bg-warning.rounded",
                  "The schedule for the selected date is not available yet."
                )
              )
            : null,
          this.schedule.length && !this.loading
            ? m__default["default"](
                "div.row",
                m__default["default"](
                  "div.col",
                  this.schedule.map((item) => {
                    return m__default["default"](ScheduleCard, { item });
                  })
                )
              )
            : m__default["default"](
                "div.row.my-5",
                m__default["default"](
                  "div.col.text-center.p-3.bg-light.text-muted.rounded",
                  "No results"
                )
              ),
        ]),
      ];
    }
  }

  m__default["default"].mount(document.body, Home);

})(m, moment);
