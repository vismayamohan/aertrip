/*! aertrip 2021-01-13 */
define({ name: "model.flightsearch", modules: ["_", "jQuery"] }).as(function (a, b, c) {
    var d = 0;
    return {
        _instance_: function (a) {
            (a = a || {}),
                (this.origResults = {}),
                (this.intlPinnedFlights = []),
                (this.sortStatus = a.sortStatus || ["humane-sorting", "asc"]),
                (this.searchIndex = 0),
                (this.searchType = a.searchType || ""),
                (this.totalLegs = a.totalLegs || ""),
                (this.nonStopFlag = a.nonStopFlag || ""),
                (this.flightNumber = a.flightNumber || ""),
                (this.showBelowHumaneThreshold = !0),
                (this.eqMaster = {}),
                (this.airlineDetails = {}),
                (this.airportDetails = {}),
                (this.alMaster = {}),
                (this.taxes = {}),
                (this.humaneThreshold = 1.26),
                (this.flightNumber = this.flightNumber.replace(/[-\s]/, "").toLowerCase()),
                this.setSearchCompletionStatus(0);
        },
        setTitle: function (a) {
            this.__title__ = a;
        },
        setSearchCompletionStatus: function (a) {
            d = a;
        },
        isSearchComplete: function () {
            return 100 == d;
        },
        toggleHumaneResultDisplay: function () {
            "I" != this.flightType ? this.applyFilters() : this.applyInternationalFilters();
        },
        clearFilter: function (a) {
            if ("I" != this.flightType) is.Empty(this.formattedFilterData) || ((this.modFilterData = JSON.parse(JSON.stringify(this.formattedFilterData))), this.applyFilters());
            else if (!is.Empty(this.intlModFilters)) {
                for (var b = 0; b < this.intlModFilters.length; b++) this.intlModFilters[b] = JSON.parse(JSON.stringify(this.intlFormattedFilters[b]));
                this.applyInternationalFilters(a);
            }
        },
        resetAllFilterPerInstance: function () {
            if ("I" != this.flightType) (this.modFilterData = JSON.parse(JSON.stringify(this.formattedFilterData))), this.applyFilters();
            else {
                this.intlModFilters[tabIndex] = JSON.parse(JSON.stringify(this.intlFormattedFilters[tabIndex]));
                for (var a = 0; a < this.intlModFilters.length; a++)
                    (this.intlModFilters[a].pr = JSON.parse(JSON.stringify(this.intlFormattedFilters[a].pr))),
                        (this.intlModFilters[a].fares = JSON.parse(JSON.stringify(this.intlFormattedFilters[a].fares))),
                        (this.intlModFilters[a].fq = JSON.parse(JSON.stringify(this.intlFormattedFilters[a].fq)));
                this.applyInternationalFilters(tabIndex);
            }
        },
        updateAllStopFilter: function (a) {
            if ("I" == this.flightType || is.Empty(this.formattedFilterData)) {
                if (!is.Empty(this.intlFormattedFilters)) {
                    for (var b = 0; b < this.intlModFilters.length; b++) this.intlModFilters[b].stp.value = a ? this.intlFormattedFilters[b].stp.stp.slice(0, 1) : this.intlFormattedFilters[b].stp.stp.slice(0);
                    this.applyInternationalFilters(), (this.superResults.resKeys = this.intlSegResultsFkeys);
                }
            } else (this.modFilterData.stp.value = a ? this.formattedFilterData.stp.stp.slice(0, 1) : this.formattedFilterData.stp.stp.slice(0)), this.applyFilters();
            this.nonStopFlag = a ? 1 : 0;
        },
        updateSICT: function (a) {
            if ("I" == this.flightType || is.Empty(this.formattedFilterData)) {
                if (!is.Empty(this.intlFormattedFilters)) {
                    for (var b = 0; b < this.intlModFilters.length; b++) this.intlModFilters[b].sict = a;
                    this.applyInternationalFilters(), (this.superResults.resKeys = this.intlSegResultsFkeys);
                }
            } else (this.modFilterData.sict = a), this.applyFilters();
        },
        updateVcode: function (a) {
            var b;
            if (!is.Empty(this.formattedFilterData))
                if (
                    (a
                        ? ((b = this.formattedFilterData.vcode.filter(function (a) {
                              return "tp" != a;
                          })),
                          b.push("tpcp"))
                        : ((b = this.formattedFilterData.vcode.filter(function (a) {
                              return "tpcp" != a;
                          })),
                          b.push("tp")),
                    (this.formattedFilterData.vcode = b),
                    "I" == this.flightType || is.Empty(this.formattedFilterData))
                ) {
                    if (!is.Empty(this.intlFormattedFilters)) {
                        for (var c = 0; c < this.intlModFilters.length; c++) this.intlModFilters[c].vcode = b;
                        this.applyInternationalFilters(), (this.superResults.resKeys = this.intlSegResultsFkeys);
                    }
                } else (this.modFilterData.vcode = b), this.applyFilters();
        },
        checkNonStopFilterState: function () {
            var a = -1;
            if ("I" != this.flightType)
                a = this.formattedFilterData && 1 === this.formattedFilterData.stp.stp.length ? "single" : !(!this.modFilterData || !b.isEqual(this.modFilterData.stp.value, this.formattedFilterData.stp.stp.slice(0, 1)));
            else {
                for (var c = 0, d = 0, e = 0; e < this.intlModFilters.length; e++)
                    1 === this.intlFormattedFilters[e].stp.stp.length
                        ? d++
                        : b.isEqual(this.intlModFilters[e].stp.value, this.intlFormattedFilters[e].stp.stp)
                        ? c--
                        : b.isEqual(this.intlModFilters[e].stp.value, this.intlFormattedFilters[e].stp.stp.slice(0, 1)) && c++;
                a = this.intlModFilters.length == c + d;
            }
            return a;
        },
        updateFilterValues: function (a, b, c) {
            if (c) {
                if (c.match(/^ar_dt|dep_dt|pr$/)) {
                    var d, e;
                    if ("ar_dt" == c || "dep_dt" == c) {
                        var f = this.getExtendedTimeRange(a, c);
                        (d = f[0]), (e = f[1]);
                    } else (d = a.minPrice), (e = a.maxPrice);
                    is.Empty(b[0]) || (b[0] < d ? (a.value[0] = d) : b[0] > e ? (a.value[0] = 0.9 * e) : (a.value[0] = b[0])), is.Empty(b[1]) || (b[1] > e ? (a.value[1] = e) : b[1] < d ? (a.value[1] = 1.1 * d) : (a.value[1] = b[1]));
                } else a.value = b;
                return a;
            }
        },
        updateFilter: function (a, b, c) {
            if ("I" != this.flightType) "pg" == a && this.updateFilterWithConvFee(), is.Empty(this.modFilterData) || ((this.modFilterData[a] = this.updateFilterValues(this.modFilterData[a], b, a)), this.applyFilters());
            else {
                if (("pg" == a && this.updateFilterIntlWithConvFee(), "pr" == a || "fares" == a || "fq" == a || "pg" == a))
                    for (var d = 0; d < this.intlModFilters.length; d++) this.intlModFilters[d][a] = this.updateFilterValues(this.intlModFilters[d][a], b, a);
                else this.intlModFilters[c][a] = this.updateFilterValues(this.intlModFilters[c][a], b, a);
                this.applyInternationalFilters(c), (this.superResults.resKeys = this.intlSegResultsFkeys);
            }
        },
        resetFilter: function (a, b) {
            if ("I" == this.flightType || is.Empty(this.modFilterData)) {
                if (!is.Empty(this.intlModFilters)) {
                    if ("pr" == a || "fares" == a || "fq" == a) for (var c = 0; c < this.intlModFilters.length; c++) this.intlModFilters[c][a].value = JSON.parse(JSON.stringify(this.intlFormattedFilters[c][a].value));
                    else this.intlModFilters[b][a].value = JSON.parse(JSON.stringify(this.intlFormattedFilters[b][a].value));
                    "pg" == a && this.updateFilterIntlWithConvFee(), this.applyInternationalFilters(b);
                }
            } else (this.modFilterData[a].value = JSON.parse(JSON.stringify(this.formattedFilterData[a].value))), "pg" == a && this.updateFilterWithConvFee(), this.applyFilters();
        },
        getFilterCondition: function (a, b, c) {
            var d;
            switch (b) {
                case "pr":
                    return this.isInBetweenComparision(a.farepr, c.pr.value);
                case "stp":
                    return -1 != c[b].value.indexOf(a[b]) ? 1 : 0;
                case "fares":
                    return 1 == c.fares.value ? (c.fares.value == a.rfd_plcy.rfd[a.fk] ? 1 : 0) : 1;
                case "al":
                    return this.checkAirlineFilter(a, b, c.al.value);
                case "ap":
                    return this.checkAirportFilter(a, b, c);
                case "loap":
                    return this.checkLayoverAirportFilter(a, b, c);
                case "tt":
                    return this.checkTotalTimeFilter(a, b, c);
                case "lott":
                    return this.checkLayoverTimeFilter(a, b, c);
                case "ar_dt":
                    return (d = this.convertTimetoApproxMinutes(a.ad + " " + a.at, c[b].earliest)), this.isInBetweenComparision(d, c[b].value);
                case "dep_dt":
                    return (d = this.convertTimetoApproxMinutes(a.dd + " " + a.dt, c[b].earliest)), this.isInBetweenComparision(d, c[b].value);
                case "eq":
                    return this.checkEquipmentFilter(a, b, c);
                case "fq":
                    return this.checkQualityFilter(a, b, c);
                case "multi_al":
                    return 0 === c[b].value ? a.al.length <= 1 : 1;
                case "sict":
                    return c[b] ? a.sict || !a.hasCorpFare : !a.sict;
                default:
                    return 1;
            }
        },
        checkEquipmentFilter: function (a, b, c) {
            var d = this;
            return (
                c.eq.eq.length === c.eq.value.length ||
                ("I" == d.flightType
                    ? a.flights.some(function (a) {
                          return c.eq.value.indexOf(d.intlResultsFlightsObj[a].eq_code) > -1;
                      })
                    : a.leg[0].flights.some(function (a) {
                          return c.eq.value.indexOf(a.eq_code) > -1;
                      }))
            );
        },
        checkFaresFilter: function (a, b, c) {
            return (
                is.Empty(c[b].value) ||
                Object.values(a.rfd_plcy.rfd).every(function (a) {
                    return c[b].value.indexOf(a.toString()) > -1;
                })
            );
        },
        checkAirlineFilter: function (a, b, c) {
            return (
                0 === a[b].length ||
                0 === c.length ||
                c.filter(function (c) {
                    return a[b].includes(c);
                }).length > 0
            );
        },
        checkAirportFilter: function (a, b, c) {
            var d = 1;
            for (var e in a[b]) {
                if (-1 == c[b].value.indexOf(a[b][e])) {
                    d = 0;
                    break;
                }
                d = 1;
            }
            return d;
        },
        checkLayoverAirportFilter: function (a, b, c) {
            if (is.Empty(a[b])) return !0;
            for (var d in a[b]) if (c[b].value.indexOf(a[b][d]) > -1) return !0;
            return !1;
        },
        checkTotalTimeFilter: function (a, b, c) {
            var d = c[b].value.map(function (a) {
                return 3600 * a;
            });
            return is.Empty(a[b]) ? this.isInBetweenComparision(0, d) : this.isInBetweenComparision(a[b], d);
        },
        checkLayoverTimeFilter: function (a, b, c) {
            var d = 0,
                e = c[b].value.map(function (a) {
                    return 3600 * a;
                });
            for (var f in a[b]) is.Empty(a[b][f]) ? this.isInBetweenComparision(0, e) && d++ : this.isInBetweenComparision(a[b][f], e) && d++;
            return d == a[b].length ? 1 : 0;
        },
        checkQualityFilter: function (a, b, c) {
            var d = 1;
            1 == a.aht && this.humaneResultsCount++, -1 === c.fq.value.indexOf("aht") && (d = 1 == a.aht ? 0 : 1);
            for (var e in c.fq.value)
                if ("aht" == c.fq.value[e]) d = 1;
                else if (a[c.fq.value[e]] > 0) {
                    d = 0;
                    break;
                }
            return d;
        },
        convertTimetoInt: function (a) {
            var b = a.split(":");
            return 60 * b[0] + 1 * b[1];
        },
        convertApproxTimetoInt: function (a, b) {
            var c,
                d = a.split(":");
            return "ceil" == b ? (c = 60 * Math.ceil(d[1] / 60)) : "floor" == b && (c = 60 * Math.floor(d[1] / 60)), 60 * d[0] + 1 * c;
        },
        convertTimetoApproxMinutes: function (a, b, c) {
            var d = "",
                e = 0;
            return (
                a !== b ? (d = moment(a).diff(moment(b).startOf("day"), "minute")) : ((d = moment(a).format("H:m").split(":")), (e = 60 * d[0]), (d = d[1])),
                (e += "ceil" == c ? 60 * Math.ceil(d / 60) : "floor" == c ? 60 * Math.floor(d / 60) : 1 * d)
            );
        },
        isInBetweenComparision: function (a, b) {
            return 1 * a >= 1 * b[0] && 1 * a <= 1 * b[1];
        },
        applyFilters: function () {
            (this.filteredResult = JSON.parse(JSON.stringify(this.formattedResults))), (this.humaneResultsCount = 0);
            for (var a in this.modFilterData)
                "searchIndex" != a &&
                    "searchType" != a &&
                    "total" != a &&
                    "fq" != a &&
                    ((this.filteredResult.PF = b.isEmpty(this.filteredResult.PF) ? [] : this.getFilteredData("PF", a)), (this.filteredResult.RF = b.isEmpty(this.filteredResult.RF) ? [] : this.getFilteredData("RF", a)));
            (this.filteredResult.PF = b.isEmpty(this.filteredResult.PF) ? [] : this.getFilteredData("PF", "fq")),
                (this.filteredResult.RF = b.isEmpty(this.filteredResult.RF) ? [] : this.getFilteredData("RF", "fq")),
                this.sortFlightsAttributes();
        },
        applyInternationalFilters: function () {
            var a,
                c,
                d = this,
                e = JSON.parse(JSON.stringify(d.intlResultsValues)),
                f = JSON.parse(JSON.stringify(d.intlResultsLegsFkeys));
            (d.intlFilteredLegFkeys = []), (d.humaneResultsCount = 0);
            for (var g in d.intlModFilters) {
                0 == g &&
                    ((e = b.filter(e, function (a) {
                        return d.getFilterCondition(a, "pr", d.intlModFilters[g]);
                    })),
                    (e = b.filter(e, function (a) {
                        return d.getFilterCondition(a, "fares", d.intlModFilters[g]);
                    })),
                    (e = b.filter(e, function (a) {
                        return d.getFilterCondition(a, "sict", d.intlModFilters[g]);
                    })));
                for (var h in d.intlModFilters[g])
                    "fq" != h &&
                        "pr" != h &&
                        "fares" != h &&
                        "sict" != h &&
                        ((d.intlFilteredLegFkeys[g] = b.filter(f[g], function (a) {
                            return d.getFilterCondition(d.intlResultsLegsObj[a], h, d.intlModFilters[g]);
                        })),
                        (e = b.filter(e, function (a) {
                            return -1 == d.intlFilteredLegFkeys[g].indexOf(a.leg[g]) ? 0 : 1;
                        })));
            }
            (e = b.filter(e, function (a) {
                return d.getFilterCondition(a, "fq", d.intlModFilters[0]);
            })),
                (d.intlFilteredResultsFkeys = b.pluck(e, "fk")),
                (a = this.groupByIntlFareAndAirline(d.intlFilteredResultsFkeys)),
                (c = a.groupedFkeys),
                (a = a.gData),
                (d.groupedFkeys = c);
            for (var i in d.groupedFkeys) for (var j in d.groupedFkeys[i]) (d.origResults[d.groupedFkeys[i][j]].gid = i), (d.origResults[d.groupedFkeys[i][j]].grpCount = this.groupedFkeys[i].length);
            d.sortIntlFlightsAttributes();
        },
        segregatePinnedAndRegularIntlFlights: function () {
            var a = this;
            a.intlSegResultsFkeys.PF = [];
            for (var c in a.intlPinnedFlights) a.intlFilteredResultsFkeys.indexOf(a.intlPinnedFlights[c].trim()) > -1 && a.intlSegResultsFkeys.PF.push(a.intlPinnedFlights[c].trim());
            a.intlSegResultsFkeys.RF = b.difference(a.intlFilteredResultsFkeys, a.intlSegResultsFkeys.PF);
        },
        getSameFareSortedLeg: function (a) {
            for (
                var b = this,
                    c = [],
                    d = [],
                    e = [],
                    f = function (a, b) {
                        for (var e = 0; e < c[b].length; e++) {
                            var g = a.slice(0);
                            g.push(c[b][e]), b == c.length - 1 ? d.push(g) : f(g, b + 1);
                        }
                    },
                    g = 0;
                g < this.totalLegs;
                g++
            ) {
                c[g] = [];
                for (var h in this.groupedFkeys[a]) {
                    var i = this.groupedFkeys[a][h];
                    c[g].push(b.origResults[i].leg[g]);
                }
            }
            for (var j in c) c[j] = b.sortLegByDepartureTime(c[j]);
            f([], 0);
            for (var k in d) e.push(d[k].join("~"));
            for (var l in e) if (this.groupedFkeys[a].indexOf(e[l]) > -1) return e[l].split("~");
        },
        getUniqueGroupIDIntlFlights: function () {
            var a = this,
                b = [],
                c = [];
            a.intlSegResultsFkeys.RF.forEach(function (d) {
                var e = a.origResults[d].gid;
                -1 == c.indexOf(e) && (c.push(e), (a.groupedFkeys[e] = a.singleIntlSort(a.groupedFkeys[e])), b.push(a.groupedFkeys[e][0]));
            }),
                (a.intlSegResultsFkeys.RF = b),
                (a.superResults.resKeys = a.intlSegResultsFkeys);
        },
        getFilteredData: function (a, c) {
            var d = this;
            return b.filter(d.filteredResult[a], function (a) {
                return d.getFilterCondition(a, c, d.modFilterData);
            });
        },
        getFilteredResults: function () {
            return this.filteredResult;
        },
        removeRedundantResult: function (a, c) {
            var d = this;
            if (is.Empty(d.origResults)) d.origResults = a;
            else {
                var e = "I" == c ? {} : [];
                b.each(a, function (a, f) {
                    var g = 0;
                    for (var h in d.origResults)
                        if ((a.ofk && !a.sict && b.isEqual(a.ofk, d.origResults[h].fk)) || (d.origResults[h].ofk && !d.origResults[h].sict && b.isEqual(a.fk, d.origResults[h].ofk)) || b.isEqual(a.fk, d.origResults[h].fk)) {
                            "I" == c ? (delete d.origResults[h], (d.origResults[f] = a)) : (d.origResults[h] = a), (g = 1);
                            break;
                        }
                    0 === g && "I" == c ? (e[f] = a) : 0 === g && e.push(a);
                }),
                    (d.origResults = "I" == c ? Object.assign({}, d.origResults, e) : d.origResults.concat(e));
            }
        },
        extractByFlightType: function (a, b, c) {
            var d = [];
            return a > b.length && (d = c > b.length ? b : b.slice(0, c)), d;
        },
        mergeInternationalResult: function (a, c, d) {
            var e = this,
                f = a.vcode;
            (a = a.results), (e.flightType = "I"), d || ((e.intlFormattedFilters = []), (e.intlModFilters = [])), (e.intlSegResultsFkeys = { PF: [], RF: [] });
            for (var g in a.eqMaster) e.eqMaster[g] = a.eqMaster[g];
            for (var h in a.aldet) e.airlineDetails[h] = a.aldet[h];
            for (var i in a.apdet) e.airportDetails[i] = a.apdet[i];
            for (var j in a.taxes) e.taxes[j] = a.taxes[j];
            for (var k in a.f) e.extractFilterData(a.f[k], e.airportDetails, e.airlineDetails, "I", f, a.eqMaster), (e.intlFormattedFilters[k] = e.formattedFilterData), (e.intlModFilters[k] = e.modFilterData);
            if (
                ("tpcp" === f && ((e.tpcpResults = JSON.parse(JSON.stringify(a.j))), e.tpLoaded && e.mergeResultsWithTPCP()),
                e.removeRedundantResult(a.j, "I"),
                ("tp" != f && "ri" != f) || ((e.tpLoaded = !0), is.Empty(e.tpcpResults) || e.mergeResultsWithTPCP()),
                e.applyHumaneSortScore(),
                (e.intlResultsValues = b.values(e.origResults)),
                (e.intlResultsValues = b.sortBy(e.intlResultsValues, function (a) {
                    return 1 * a.farepr;
                })),
                (e.intlResultsFkeys = b.pluck(e.intlResultsValues, "fk")),
                b.isEmpty(e.intlResultsLegsObj))
            )
                e.intlResultsLegsObj = a.ldet;
            else for (var l in a.ldet) e.intlResultsLegsObj[l] = a.ldet[l];
            if (
                ((e.intlResultsLegsValues = b.values(e.intlResultsLegsObj)),
                (e.intlResultsLegsFkeys = b.keys(e.intlResultsLegsObj)),
                (e.intlResultsLegsFkeys = b.groupBy(e.intlResultsLegsFkeys, function (a) {
                    return e.intlResultsLegsObj[a].lid;
                })),
                (e.intlResultsLegsFkeys = b.values(e.intlResultsLegsFkeys)),
                e.assignFastestLeg(),
                b.isEmpty(e.intlResultsFlightsObj))
            )
                e.intlResultsFlightsObj = a.fdet;
            else for (var m in a.fdet) e.intlResultsFlightsObj[m] = a.fdet[m];
            (e.superResults = { resKeys: "", rdet: e.origResults, ldet: e.intlResultsLegsObj, fdet: e.intlResultsFlightsObj, AL: e.airlineDetails, AP: e.airportDetails, SS: e.sortStatus, taxes: e.taxes }),
                (is.Empty(c) && is.Empty(e.flightNumber)) || (e.intlPinnedFlights = e.extractIntlPinnedFlights(c)),
                e.addAirlineToShow(),
                e.applyInternationalFilters(0),
                0 === this.getHiddenHumanResultsCount() && (delete this.formattedFilterData.fq.fq.aht, delete this.modFilterData.fq.fq.aht);
        },
        addAirlineToShow: function () {
            var a = this,
                c = [],
                d = b.sortBy(a.intlResultsFkeys, function (b) {
                    return 1 * a.origResults[b].humane_score;
                });
            for (var e in d) {
                var f = a.origResults[d[e]];
                for (var g in f.leg) {
                    if (((c[g] = c[g] || []), c[g].length > 5)) break;
                    var h = a.intlResultsLegsObj[f.leg[g]];
                    c[g] = b.uniq(c[g].concat(h.al));
                }
            }
            for (var i in c) (this.intlFormattedFilters[i].alToShow = c[i]), (this.intlModFilters[i].alToShow = c[i]);
        },
        assignFastestLeg: function () {
            var a = this,
                c = {};
            for (var d in a.intlResultsLegsFkeys)
                c[d] = b.min(a.intlResultsLegsFkeys[d], function (b) {
                    return a.arraySum(a.intlResultsLegsObj[b].tt);
                });
            for (var e in a.intlResultsLegsFkeys)
                for (var f in a.intlResultsLegsFkeys[e]) {
                    var g = a.intlResultsLegsFkeys[e][f];
                    a.arraySum(a.intlResultsLegsObj[g].tt) == a.arraySum(a.intlResultsLegsObj[c[e]].tt) ? (a.intlResultsLegsObj[g].fastest = !0) : (a.intlResultsLegsObj[g].fastest = !1);
                }
        },
        getSameFareUniqueLegs: function (a, b) {
            var c = this,
                d = [];
            (this.allowedLegs = {}), (this.selectedLegs = []), (this.selectedFKey = a), (this.selectedLegs = JSON.parse(JSON.stringify(this.origResults[a].leg)));
            for (var e = 0; e < this.totalLegs; e++) {
                d[e] = [];
                for (var f in this.groupedFkeys[b]) {
                    var g = this.groupedFkeys[b][f];
                    d[e].push(c.origResults[g].leg[e]);
                }
            }
            for (var h in d) d[h] = c.sortLegByDepartureTime(d[h]);
            (this.allowedLegs = JSON.parse(JSON.stringify(d))), c.getSameFareAllowedLegs(this.selectedLegs[0], 0, b), (this.intlSameFareLegs = d);
        },
        sortLegByDepartureTime: function (a) {
            var c = this;
            return (
                (a = b.unique(a)),
                a.sort(function (a, b) {
                    var d = c.intlResultsLegsObj[a],
                        e = c.intlResultsLegsObj[b],
                        f = 1 * d.dt.replace(":", ""),
                        g = 1 * e.dt.replace(":", "");
                    if (f !== g) return c.sortCompare(f, g, "asc");
                    for (var h = 0; h < d.flights.length; h++) {
                        var i,
                            j = 1 * c.intlResultsFlightsObj[d.flights[h]].dt.replace(":", "");
                        if (void 0 === e.flights[h]) return 1;
                        if (((i = 1 * c.intlResultsFlightsObj[e.flights[h]].dt.replace(":", "")), j !== i))
                            return c.intlResultsFlightsObj[d.flights[h]].dd == c.intlResultsFlightsObj[e.flights[h]].dd ? c.sortCompare(j, i, "asc") : c.sortCompare(j, i, "desc");
                    }
                }),
                a
            );
        },
        getSameFareAllowedLegs: function (a, b, c) {
            for (this.selectedLegs[b] = a, i = b + 1; i < this.totalLegs; i++) {
                this.allowedLegs[i] = [];
                for (var d in this.groupedFkeys[c]) {
                    for (var e = -1, f = i - 1; f >= 0; f--) -1 == this.origResults[this.groupedFkeys[c][d]].leg.indexOf(this.selectedLegs[f]) && (e = 0);
                    -1 == e && this.allowedLegs[i].push(this.origResults[this.groupedFkeys[c][d]].leg[i]);
                }
                (this.allowedLegs[i] = this.sortLegByDepartureTime(this.allowedLegs[i])), -1 == this.allowedLegs[i].indexOf(this.selectedLegs[i]) && (this.selectedLegs[i] = this.allowedLegs[i][0]);
            }
        },
        getSelectedLegsCombination: function (a) {
            for (var c in this.groupedFkeys[a]) {
                b.isEqual(this.origResults[this.groupedFkeys[a][c]].leg, this.selectedLegs) && (fk = this.groupedFkeys[a][c]);
            }
            var d = this.intlSegResultsFkeys.RF.indexOf(this.selectedFKey);
            return (this.intlSegResultsFkeys.RF[d] = fk), (this.superResults.resKeys = this.intlSegResultsFkeys), fk;
        },
        mergeResult: function (a, c) {
            var d = this,
                e = a.vcode;
            if (((a = a.results), (d.flightType = "D"), (d.formattedResults = { PF: [], RF: [], AL: [], AP: [], alMaster: [] }), !is.Empty(a.j))) {
                if (
                    ("tpcp" === e && ((d.tpcpResults = JSON.parse(JSON.stringify(a.j))), d.tpLoaded && d.mergeResultsWithTPCP()),
                    a.f.length > 0 && d.extractFilterData(a.f[0], d.airportDetails, d.airlineDetails, "D", e, a.eqMaster),
                    d.removeRedundantResult(a.j, "D"),
                    (d.origResults = b.sortBy(d.origResults, function (a) {
                        return 1 * a.farepr;
                    })),
                    ("tp" != e && "ri" != e) || ((d.tpLoaded = !0), is.Empty(d.tpcpResults) || d.mergeResultsWithTPCP()),
                    d.applyHumaneSortScore(),
                    (is.Empty(c) && is.Empty(d.flightNumber)) || (d.formattedResults.PF = d.extractPinnedFlights(c)),
                    (d.formattedResults.RF = JSON.parse(JSON.stringify(d.origResults))),
                    "S" == d.searchType)
                ) {
                    var f = d.groupByFareAndAirline(d.formattedResults.RF),
                        g = f.groupedFkeys;
                    for (var h in d.formattedResults.RF) for (var i in g) -1 != g[i].indexOf(d.formattedResults.RF[h].fk) && (d.formattedResults.RF[h].gid = i);
                    if (!is.Empty(d.formattedResults.PF))
                        for (var h in d.formattedResults)
                            if ("PF" != h)
                                for (var i = 0; i < d.formattedResults.PF.length; i++) {
                                    var j = b.pluck(d.formattedResults[h], "fk").indexOf(d.formattedResults.PF[i].fk);
                                    j > -1 && ((d.formattedResults.PF[i] = d.formattedResults[h].splice(j, 1)[0]), (d.formattedResults.PF[i].from = h));
                                }
                }
                for (var k in a.eqMaster) d.eqMaster[k] = a.eqMaster[k];
                for (var l in a.aldet) d.airlineDetails[l] = a.aldet[l];
                for (var m in a.apdet) d.airportDetails[m] = a.apdet[m];
                for (var n in a.taxes) d.taxes[n] = a.taxes[n];
                for (var o in a.alMaster) d.alMaster[o] = a.alMaster[o];
                (d.formattedResults.AL = d.airlineDetails),
                    (d.formattedResults.alMaster = d.alMaster),
                    (d.formattedResults.AP = d.airportDetails),
                    (d.formattedResults.taxes = d.taxes),
                    (d.formattedResults.SS = d.sortStatus),
                    (d.filteredResult = JSON.parse(JSON.stringify(d.formattedResults))),
                    d.sortFlightsAttributes();
                var p = [];
                for (var o in d.filteredResult.RF) if (((p = b.uniq(p.concat(d.filteredResult.RF[o].al))), p.length > 5)) break;
                (this.formattedFilterData.alToShow = p),
                    (this.modFilterData.alToShow = p),
                    this.applyFilters(),
                    0 === this.getHiddenHumanResultsCount() && (delete this.formattedFilterData.fq.fq.aht, delete this.modFilterData.fq.fq.aht),
                    (this.superResults = d.filteredResult);
            }
        },
        mergeResultsWithTPCP: function () {
            var a = this;
            b.map(a.origResults, function (c, d) {
                b.map(a.tpcpResults, function (b) {
                    b.ofk == c.fk && ((a.origResults[d].hasCorpFare = !0), (a.origResults[d].corpFk = b.fk));
                });
            });
        },
        extractPinnedFlights: function (a) {
            var c = this;
            return b.filter(c.origResults, function (b) {
                var d = !1;
                return (
                    (d = a && a.indexOf(b.fk) > -1),
                    is.Empty(c.flightNumber) ||
                        d ||
                        (d =
                            b.leg.filter(function (a) {
                                return (
                                    a.flights.filter(function (a) {
                                        return (a.al + a.fn).toLowerCase() == c.flightNumber;
                                    }).length > 0
                                );
                            }).length > 0),
                    d
                );
            });
        },
        extractIntlPinnedFlights: function (a) {
            var c = this;
            return b.filter(c.intlResultsFkeys, function (b) {
                var d = !1;
                return (
                    (d = a && a.indexOf(b) > -1),
                    is.Empty(c.flightNumber) ||
                        d ||
                        (d =
                            c.origResults[b].leg.filter(function (a) {
                                return (
                                    c.intlResultsLegsObj[a].flights.filter(function (a) {
                                        return (c.intlResultsFlightsObj[a].al + c.intlResultsFlightsObj[a].fn).toLowerCase() == c.flightNumber;
                                    }).length > 0
                                );
                            }).length > 0),
                    d
                );
            });
        },
        groupByFareAndAirline: function (a) {
            function c(a) {
                var d = b.min(a, function (a) {
                    return e.arraySum(a.tt);
                });
                d = e.arraySum(d.tt);
                var f = b.groupBy(a, function (a) {
                    return e.arraySum(a.tt) <= 1.2 * d ? d : "temp";
                });
                return (g[d] = f[d]), is.Empty(f.temp) ? g : c(f.temp);
            }
            var d = [],
                e = this,
                f = b.groupBy(a, function (a) {
                    return 1 * a.farepr;
                }),
                g = {},
                h = 0;
            for (var i in f) {
                f[i] = b.groupBy(f[i], "al");
                for (var j in f[i]) {
                    f[i][j] = b.groupBy(f[i][j], "stp");
                    for (var k in f[i][j]) {
                        f[i][j][k] = b.groupBy(f[i][j][k], function (a) {
                            return a.ap[a.ap.length - 1];
                        });
                        for (var l in f[i][j][k]) {
                            (g = {}), (f[i][j][k][l] = c(f[i][j][k][l]));
                            for (var m in f[i][j][k][l]) (d[h] = b.pluck(f[i][j][k][l][m], "fk")), h++;
                        }
                    }
                }
            }
            return { gData: f, groupedFkeys: d };
        },
        groupByIntlFareAndAirline: function (a) {
            var c = this,
                d = [],
                e = b.groupBy(a, function (a) {
                    return 1 * c.origResults[a].farepr;
                }),
                f = 0;
            for (var g in e) {
                e[g] = b.groupBy(e[g], function (a) {
                    return c.origResults[a].al[0];
                });
                for (var h in e[g]) {
                    e[g][h] = b.groupBy(e[g][h], function (a) {
                        return c.origResults[a].qid;
                    });
                    for (var i in e[g][h]) (d[f] = e[g][h][i]), f++;
                }
            }
            return { gData: e, groupedFkeys: d };
        },
        getExtendedTimeRange: function (a, b) {
            var d = c.extend(!0, {}, a),
                e = this.convertTimetoApproxMinutes(d.earliest, d.earliest, "floor"),
                f = this.convertTimetoApproxMinutes(d.latest, d.earliest, "ceil");
            return (f = e + 360 * Math.ceil((f - e) / 360)), "dep_dt" == b && f > 1440 && ((e -= f - 1440), (f = 1440)), [e, f];
        },
        updateSliderTypeFilterValue: function (a, b, c) {
            var d = 0;
            for (var e in b)
                (this.formattedFilterData[a][e] = b[e]),
                    (this.modFilterData[a][e] = this.formattedFilterData[a][e]),
                    this.formattedFilterData[a].value[d] == this.modFilterData[a].value[d] && (this.modFilterData[a].value[d] = c[d]),
                    (this.formattedFilterData[a].value[d] = c[d]),
                    d++;
        },
        sortEqMaster: function (a) {
            var b = this;
            return a.sort(function (a, c) {
                if (b.eqMaster[a] && b.eqMaster[c]) return 1 === b.eqMaster[a].quality && 1 != b.eqMaster[c].quality ? -1 : 1 != b.eqMaster[a].quality && 1 === b.eqMaster[c].quality ? 1 : b.eqMaster[a].name > b.eqMaster[c].name ? 1 : -1;
            });
        },
        extractFilterData: function (a, b, c, d, e, f) {
            if (is.Empty(this.modFilterData) || "I" == d) {
                var g = JSON.parse(JSON.stringify((this.formattedFilterData || {}).vcode || []));
                (this.formattedFilterData = a),
                    (this.formattedFilterData.vcode = g),
                    (this.formattedFilterData.sict = !1),
                    (this.formattedFilterData.pr.value = [a.pr.minPrice, a.pr.maxPrice]),
                    (this.formattedFilterData.tt.value = [Math.floor(parseInt(a.tt.minTime) / 3600), Math.ceil(parseInt(a.tt.maxTime) / 3600)]),
                    is.Empty(a.lott) ? (this.formattedFilterData.lott.value = [0, 0]) : (this.formattedFilterData.lott.value = [Math.floor(parseInt(a.lott.minTime) / 3600), Math.ceil(parseInt(a.lott.maxTime) / 3600)]),
                    (this.formattedFilterData.ar_dt.value = this.getExtendedTimeRange(a.ar_dt, "ar_dt")),
                    (this.formattedFilterData.dep_dt.value = this.getExtendedTimeRange(a.dep_dt, "dep_dt")),
                    (this.formattedFilterData.stp = { stp: JSON.parse(JSON.stringify(a.stp)), value: JSON.parse(JSON.stringify(a.stp)) }),
                    (this.formattedFilterData.fares = { fares: a.fares, value: a.fares }),
                    (this.formattedFilterData.al = { al: JSON.parse(JSON.stringify(a.al)), value: JSON.parse(JSON.stringify(a.al)) }),
                    (this.formattedFilterData.eq = { eq: this.sortEqMaster(JSON.parse(JSON.stringify(a.eq || []))), value: JSON.parse(JSON.stringify(a.eq || [])) }),
                    (this.formattedFilterData.ap = { ap: JSON.parse(JSON.stringify(a.ap)), value: JSON.parse(JSON.stringify(a.ap)) }),
                    (this.formattedFilterData.loap = { loap: JSON.parse(JSON.stringify(a.loap)), value: JSON.parse(JSON.stringify(a.loap)) }),
                    (this.formattedFilterData.fq = { fq: a.fq, value: [] }),
                    (this.formattedFilterData.multi_al = { multi_al: a.multi_al, value: a.multi_al }),
                    (this.formattedFilterData.pg = { value: "" }),
                    (this.modFilterData = JSON.parse(JSON.stringify(this.formattedFilterData)));
            } else
                for (var h in a) {
                    var i = "";
                    switch (h) {
                        case "pr":
                            (i = [a.pr.minPrice, a.pr.maxPrice]), this.updateSliderTypeFilterValue(h, a[h], i);
                            break;
                        case "ar_dt":
                        case "dep_dt":
                            this.updateSliderTypeFilterValue(h, a[h], this.getExtendedTimeRange(a[h], h));
                            break;
                        case "tt":
                            (i = [Math.floor(parseInt(a.tt.minTime) / 3600), Math.ceil(parseInt(a.tt.maxTime) / 3600)]), this.updateSliderTypeFilterValue(h, a[h], i);
                            break;
                        case "lott":
                            (i = [Math.floor(parseInt(a.lott.minTime) / 3600), Math.ceil(parseInt(a.lott.maxTime) / 3600)]), this.updateSliderTypeFilterValue(h, a[h], i);
                            break;
                        case "al":
                        case "eq":
                        case "ap":
                        case "loap":
                        case "stp":
                        case "fares":
                            for (var j in a[h]) -1 == this.formattedFilterData[h][h].indexOf(a[h][j]) && ((this.formattedFilterData[h].value = a[h]), this.modFilterData[h].value.push(a[h][j]));
                            (this.formattedFilterData[h][h] = a[h]), (this.modFilterData[h][h] = a[h]);
                            break;
                        case "fq":
                            (this.formattedFilterData.fq.fq = a.fq), (this.modFilterData.fq.fq = a.fq);
                            break;
                        case "multi_al":
                            a[h] &&
                                (0 == this.modFilterData.multi_al.multi_al && (this.modFilterData.multi_al.value = 1),
                                (this.formattedFilterData.multi_al.multi_al = a[h]),
                                (this.formattedFilterData.multi_al.value = a[h]),
                                (this.modFilterData.multi_al.multi_al = a[h]));
                            break;
                        case "origin_tz":
                        case "destination_tz":
                            (this.modFilterData[h] = a[h]), (this.formattedFilterData[h] = a[h]);
                    }
                }
            -1 === this.formattedFilterData.vcode.indexOf(e) && (-1 === this.modFilterData.vcode.indexOf(e) && this.modFilterData.vcode.push(e), this.formattedFilterData.vcode.push(e)),
                this.modFilterData.stp.value.sort(),
                this.modFilterData.stp.stp.sort(),
                this.formattedFilterData.stp.stp.sort(),
                this.formattedFilterData.stp.value.sort(),
                (this.modFilterData.stp.value = 1 == this.nonStopFlag ? this.formattedFilterData.stp.value.slice(0, 1) : this.modFilterData.stp.value),
                (this.formattedFilterData.apdet = b),
                (this.formattedFilterData.aldet = c),
                (this.formattedFilterData.eqMaster = f),
                (this.formattedFilterData.cityap = a.cityap_n),
                (this.modFilterData.apdet = b),
                (this.modFilterData.aldet = c),
                (this.modFilterData.eqMaster = f),
                (this.modFilterData.cityap = a.cityap_n);
        },
        updateChangeResultsFilters: function (a) {
            var b = this.formattedFilterData.pr,
                c = this.modFilterData.pr;
            this._updateChangedFareFilter(b, c, a);
        },
        _updateChangedFareFilter: function (a, b, c) {
            c < a.minPrice
                ? (b.value[0] == b.minPrice && (b.value[0] = c), (b.minPrice = c), (a.minPrice = c), (a.value[0] = c))
                : c > a.maxPrice && (b.value[1] == b.maxPrice && (b.value[1] = c), (b.maxPrice = c), (a.maxPrice = c), (a.value[1] = c));
        },
        updateIntlChangeResultsFilters: function (a) {
            for (var b = 0; b < this.intlModFilters.length; b++) {
                var c = this.intlFormattedFilters[b].pr,
                    d = this.intlModFilters[b].pr;
                this._updateChangedFareFilter(c, d, a);
            }
        },
        extractTimelineData: function () {
            var a = moment(this.modFilterData.origin_tz.min).format("YYYY-MM-DD"),
                b = moment(this.modFilterData.destination_tz.min).diff(moment(this.modFilterData.origin_tz.min), "minutes"),
                c = moment(this.modFilterData.origin_tz.max).diff(moment(a).startOf("day"), "minute"),
                d = c < 1440 ? 1440 : 480 * Math.ceil(c / 480),
                e = d - c,
                f = moment(this.formattedFilterData.ar_dt.earliest).format("H:m").split(":"),
                g = moment(this.formattedFilterData.ar_dt.latest).diff(moment(this.formattedFilterData.ar_dt.earliest).startOf("day"), "minute");
            return {
                timezone: 0 === b ? "single" : "multi",
                min: 0,
                max: d,
                base: a,
                offset: b,
                origin: { min: this.formattedFilterData.dep_dt.value[0], max: 1439 },
                destination: { extraMax: e, min: 60 * f[0] + 1 * f[1], max: this.formattedFilterData.ar_dt.value[1], maxExact: g },
            };
        },
        singleSort: function (a) {
            var c,
                d,
                e = this;
            if (
                (a.sort(function (a, b) {
                    switch (e.sortStatus[0]) {
                        case "depart-sorting":
                            return (c = moment(a.dd + " " + a.dt).valueOf()), (d = moment(b.dd + " " + b.dt).valueOf()), e.singleSecondLevelSort(c, d, 1 * a.farepr, 1 * b.farepr);
                        case "arrive-sorting":
                            return (c = moment(a.ad + " " + a.at).valueOf()), (d = moment(b.ad + " " + b.at).valueOf()), e.singleSecondLevelSort(c, d, 1 * a.farepr, 1 * b.farepr);
                        case "duration-sorting":
                            var f = e.arraySum(a.tt),
                                g = e.arraySum(b.tt);
                            return e.singleSecondLevelSort(f, g, 1 * a.farepr, 1 * b.farepr);
                        case "airline-sorting":
                            return e.singleSecondLevelSort(e.airlineDetails[a.al[0]], e.airlineDetails[b.al[0]], 1 * a.farepr, 1 * b.farepr);
                        case "price-sorting":
                            return (c = moment(a.dd + " " + a.dt).valueOf()), (d = moment(b.dd + " " + b.dt).valueOf()), e.singleSecondLevelSort(1 * a.farepr, 1 * b.farepr, c, d);
                        case "humane-sorting":
                            return "S" == e.searchType
                                ? ((c = moment(a.dd + " " + a.dt).valueOf()), (d = moment(b.dd + " " + b.dt).valueOf()), e.singleSecondLevelSort(1 * a.farepr, 1 * b.farepr, c, d))
                                : e.singleSecondLevelSort(a.humane_score, b.humane_score, 1 * a.farepr, 1 * b.farepr);
                    }
                }),
                "humane-sorting" == e.sortStatus[0] && "S" == e.searchType)
            ) {
                var f = [],
                    g = b.groupBy(a, "gid"),
                    h = Object.keys(g);
                h.sort(function (a, c) {
                    var d = b.sortBy(g[a], function (a) {
                            return a.humane_score;
                        }),
                        f = b.sortBy(g[c], function (a) {
                            return a.humane_score;
                        });
                    return e.sortCompare(d[0].humane_score, f[0].humane_score, e.sortStatus[1]);
                });
                for (var i in h) f = f.concat(g[h[i]]);
                a = f;
            }
            return a;
        },
        singleIntlSecondLevelSort: function (a, b, c, d) {
            var e = this;
            return a !== b ? e.sortCompare(a, b, e.sortStatus[1]) : e.sortCompare(1 * e.origResults[c].farepr, 1 * e.origResults[d].farepr, e.sortStatus[1]);
        },
        singleSecondLevelSort: function (a, b, c, d) {
            var e = this;
            return a !== b ? e.sortCompare(a, b, e.sortStatus[1]) : e.sortCompare(c, d, e.sortStatus[1]);
        },
        singleIntlSort: function (a) {
            var b = this;
            return (
                a.sort(function (a, c) {
                    var d = b.intlResultsLegsObj[b.origResults[a].leg[b.searchIndex]],
                        e = b.intlResultsLegsObj[b.origResults[c].leg[b.searchIndex]];
                    switch (b.sortStatus[0]) {
                        case "depart-sorting":
                            var f = moment(d.dd + " " + d.dt).valueOf(),
                                g = moment(e.dd + " " + e.dt).valueOf();
                            return b.singleIntlSecondLevelSort(f, g, a, c);
                        case "arrive-sorting":
                            var f = moment(d.ad + " " + d.at).valueOf(),
                                g = moment(e.ad + " " + e.at).valueOf();
                            return b.singleIntlSecondLevelSort(f, g, a, c);
                        case "duration-sorting":
                            return b.sortCompare(b.arraySum(b.origResults[a].tt), b.arraySum(b.origResults[c].tt), b.sortStatus[1]);
                        case "airline-sorting":
                            return b.singleIntlSecondLevelSort(b.airlineDetails[d.al[0]], b.airlineDetails[e.al[0]], a, c);
                        case "price-sorting":
                            return b.origResults[a].farepr !== b.origResults[c].farepr
                                ? b.sortCompare(1 * b.origResults[a].farepr, 1 * b.origResults[c].farepr, b.sortStatus[1])
                                : b.sortCompare(b.airlineDetails[b.origResults[a].al[0]], b.airlineDetails[b.origResults[c].al[0]], b.sortStatus[1]);
                        case "humane-sorting":
                            return b.singleIntlSecondLevelSort(b.origResults[a].humane_score, b.origResults[c].humane_score, a, c);
                    }
                }),
                a
            );
        },
        sortFlightsAttributes: function (a) {
            var b = this;
            if (((b.sortStatus = void 0 == a ? b.sortStatus : a), "S" != this.searchType || ("price-sorting" != this.sortStatus[0] && "airline-sorting" != this.sortStatus[0])))
                b.filteredResult.RF = is.Empty(b.filteredResult.RF) ? [] : b.singleSort(b.filteredResult.RF);
            else {
                var c = "price-sorting" == this.sortStatus[0] ? "farepr" : "al";
                is.Empty(b.filteredResult.RF) || b.multiSort(b.filteredResult.RF, [c, "gid"], this.sortStatus[1]);
            }
            b.filteredResult.SS = this.sortStatus;
        },
        sortIntlFlightsAttributes: function (a) {
            var b = this;
            if (
                ((b.sortStatus = void 0 === a ? b.sortStatus : a),
                (b.intlFilteredResultsFkeys = is.Empty(b.intlFilteredResultsFkeys) ? [] : b.singleIntlSort(b.intlFilteredResultsFkeys)),
                (b.superResults.SS = b.sortStatus),
                b.segregatePinnedAndRegularIntlFlights(),
                !is.Empty(b.intlPinnedFlights))
            )
                for (var c in b.intlPinnedFlights) {
                    var d = b.origResults[b.intlPinnedFlights[c]].gid;
                    b.removeFlightFromGroupedFkeys(d, b.intlPinnedFlights[c]), b.updateGroupedFkeys(d);
                }
            b.getUniqueGroupIDIntlFlights();
        },
        multiSort: function (a, b, c) {
            var d = this;
            a.sort(function (a, e) {
                if ("farepr" == b[0])
                    var f = parseInt(a[b[0]]),
                        g = parseInt(e[b[0]]);
                else
                    var f = d.airlineDetails[a[b[0]][0]],
                        g = d.airlineDetails[e[b[0]][0]];
                if (f !== g) return d.sortCompare(f, g, c);
                if (parseInt(a[b[1]]) !== parseInt(e[b[1]])) return d.sortCompare(parseInt(a[b[1]]), parseInt(e[b[1]]), c);
                for (var h = 0; h < a.leg[0].flights.length; h++) {
                    var i = parseInt(a.leg[0].flights[h].dt.replace(":", ""));
                    if (void 0 == e.leg[0].flights[h]) return 1;
                    var j = parseInt(e.leg[0].flights[h].dt.replace(":", ""));
                    if (i !== j) return a.leg[0].flights[h].dd == e.leg[0].flights[h].dd ? d.sortCompare(i, j, "asc") : d.sortCompare(i, j, "desc");
                }
            });
        },
        sortCompare: function (a, b, c) {
            return a === b ? 0 : "asc" == c ? (a > b ? 1 : -1) : a > b ? -1 : 1;
        },
        getAirlineWiseMinFare: function () {
            var a = {},
                c = b.groupBy(this.origResults, function (a) {
                    if (1 == a.al.length) return a.al[0];
                    for (var b = a.al[0], c = 0; c < a.al.length; c++) if (a.al[c] != b) return 0;
                    return a.al[0];
                });
            return (
                b.each(c, function (b, c) {
                    if (0 != c) {
                        (a[c] = { fare: "", fk: "" }), (a[c].fare = b[0].farepr), (a[c].fk = b[0].fk);
                        for (var d = 0; d < b.length; d++) parseInt(a[c]) > parseInt(b[d].farepr) && ((a[c].fare = b[d].farepr), (a[c].fk = b[d].fk));
                    }
                }),
                a
            );
        },
        addPinnedResults: function (a) {
            var c = this,
                d = b.filter(c.formattedResults[a[0]], function (b) {
                    return b.fk === a[1];
                });
            (c.formattedResults[a[0]] = b.filter(c.formattedResults[a[0]], function (b) {
                return b.fk !== a[1];
            })),
                (c.filteredResult[a[0]] = b.filter(c.filteredResult[a[0]], function (b) {
                    return b.fk !== a[1];
                })),
                (d[0].from = a[0]),
                c.formattedResults.PF.unshift(d[0]),
                c.filteredResult.PF.unshift(d[0]);
        },
        addIntlPinnedResults: function (a, b) {
            var c = this,
                a = a.trim();
            c.intlPinnedFlights.unshift(b), c.segregatePinnedAndRegularIntlFlights(), c.removeFlightFromGroupedFkeys(a, b), c.updateGroupedFkeys(a), c.getUniqueGroupIDIntlFlights();
        },
        updateGroupedFkeys: function (a) {
            var b = this;
            for (var c in this.groupedFkeys[a]) this.groupedFkeys[a].length > 1 ? (b.origResults[this.groupedFkeys[a][c]].grpCount = this.groupedFkeys[a].length) : (b.origResults[this.groupedFkeys[a][c]].grpCount = 0);
        },
        removeIntlPinnedFlight: function (a, c) {
            var d = this,
                a = "string" == typeof a ? a.trim() : a.toString();
            (d.intlPinnedFlights = b.without(d.intlPinnedFlights, c)), d.segregatePinnedAndRegularIntlFlights(), d.addFlightIntoGroupedFkeys(a, c), d.updateGroupedFkeys(a), d.getUniqueGroupIDIntlFlights();
        },
        removePinnedFlight: function (a) {
            var c = b.filter(this.formattedResults.PF, function (b) {
                return b.fk === a[1];
            });
            this.formattedResults[a[0]].push(c[0]),
                this.filteredResult[a[0]].push(c[0]),
                (this.formattedResults.PF = b.filter(this.formattedResults.PF, function (b) {
                    return b.fk !== a[1];
                })),
                (this.filteredResult.PF = b.filter(this.filteredResult.PF, function (b) {
                    return b.fk !== a[1];
                })),
                this.sortFlightsAttributes();
        },
        removeFlightFromGroupedFkeys: function (a, c) {
            void 0 != a && "" != a && (this.groupedFkeys[a.trim()] = b.without(this.groupedFkeys[a.trim()], c));
        },
        addFlightIntoGroupedFkeys: function (a, b) {
            void 0 != a && "" != a && this.groupedFkeys[a].push(b);
        },
        getResultsHavingFkey: function (a) {
            var c = this;
            return b.filter(c.origResults, function (b) {
                return a === b.fk;
            })[0];
        },
        getResultsHavingFkeys: function (a) {
            var c = this;
            return b.filter(c.origResults, function (b) {
                return a.indexOf(b.fk) > -1;
            });
        },
        getSingleTypeResults: function (a) {
            return this.formattedResults[a];
        },
        getFilteredResultsHavingFkey: function (a) {
            var b,
                c = this;
            for (var d in c.filteredResult) for (var e in c.filteredResult[d]) a === c.filteredResult[d][e].fk && (b = c.filteredResult[d][e]);
            return b;
        },
        getHiddenHumanResultsCount: function () {
            return this.humaneResultsCount;
        },
        getFilteredResultsCount: function () {
            var a = 0;
            return (
                "D" == this.flightType
                    ? b.each(this.filteredResult, function (b, c) {
                          ("PF" != c && "RF" != c) || (a += b.length);
                      })
                    : "I" == this.flightType && (a = this.intlFilteredResultsFkeys.length),
                a
            );
        },
        getResultsCount: function () {
            var a = 0;
            return (
                "D" == this.flightType
                    ? b.each(this.formattedResults, function (b, c) {
                          ("PF" != c && "RF" != c) || (a += b.length);
                      })
                    : "I" == this.flightType && (a = this.intlResultsValues.length),
                a
            );
        },
        setComboResults: function (a) {
            this.removeRedundantResult(a.results.c, "D"), (this.specialComboResults = is.Empty(this.origResults) ? {} : JSON.parse(JSON.stringify(this.origResults)));
        },
        getDefaultSelectedFlight: function () {
            return this.filteredResult.RF.slice(0, 1)[0];
        },
        getTimeBetweenRange: function (a) {
            var c = this,
                d = [];
            if ("I" == this.flightType || ("R" == this.searchType && "M" == this.searchType))
                for (
                    var e = 1 * this.intlModFilters[a].pr.minPrice,
                        f = 1 * this.intlModFilters[a].pr.maxPrice,
                        g = (f - e) / 34,
                        h = 0,
                        i = b.sortBy(c.intlResultsFkeys, function (a) {
                            return 1 * a.farepr;
                        }),
                        j = 0;
                    j < 34;
                    j++
                )
                    for (d[j] = d[j] || []; h < i.length && !(this.origResults[i[h]].farepr > e + (j + 1) * g); h++) {
                        var k = this.intlResultsLegsObj[this.origResults[i[h]].leg[a]];
                        k && d[j].push(k.dd + " " + k.dt);
                    }
            else
                for (
                    var e = 1 * this.modFilterData.pr.minPrice,
                        f = 1 * this.modFilterData.pr.maxPrice,
                        g = (f - e) / 34,
                        h = 0,
                        l = b.sortBy(this.origResults, function (a) {
                            return 1 * a.farepr;
                        }),
                        j = 0;
                    j < 34;
                    j++
                )
                    for (d[j] = is.Empty(d[j]) ? [] : d[j]; h < l.length && !(l[h].farepr > e + (j + 1) * g); h++) d[j].push(l[h].dd + " " + l[h].dt);
            return d;
        },
        getFareBetweenRange: function (a, c) {
            var d = [];
            if ("I" == this.flightType || ("R" == this.searchType && "M" == this.searchType))
                for (
                    var e = this,
                        f = moment(e.intlModFilters[a][c].latest),
                        g = moment(e.intlModFilters[a][c].earliest),
                        h = e.convertTimetoApproxMinutes(e.intlModFilters[a][c].earliest, e.intlModFilters[a][c].earliest),
                        i = f.diff(g, "minutes") / 34,
                        j = 0,
                        k = b.sortBy(e.intlResultsFkeys, function (b) {
                            var d = e.intlResultsLegsObj[e.origResults[b].leg[a]];
                            return moment("dep_dt" == c ? d.dd + " " + d.dt : d.ad + " " + d.at).valueOf();
                        }),
                        l = 0;
                    l < 34;
                    l++
                )
                    for (d[l] = is.Empty(d[l]) ? [] : d[l]; j < k.length; j++) {
                        var m = e.intlResultsLegsObj[e.origResults[k[j]].leg[a]],
                            n = e.convertTimetoApproxMinutes(m["dep_dt" == c ? "dd" : "ad"] + " " + m["dep_dt" == c ? "dt" : "at"], e.intlModFilters[a][c].earliest);
                        if (n > h + (l + 1) * i) break;
                        d[l].push(e.origResults[k[j]].farepr);
                    }
            else
                for (
                    var f = moment(this.modFilterData[c].latest),
                        g = moment(this.modFilterData[c].earliest),
                        h = this.convertTimetoApproxMinutes(this.modFilterData[c].earliest, this.modFilterData[c].earliest),
                        i = f.diff(g, "minutes") / 34,
                        j = 0,
                        o = b.sortBy(this.origResults, function (a) {
                            return moment("dep_dt" == c ? a.dd + " " + a.dt : a.ad + " " + a.at).valueOf();
                        }),
                        l = 0;
                    l < 34;
                    l++
                )
                    for (d[l] = is.Empty(d[l]) ? [] : d[l]; j < o.length; j++) {
                        var n = this.convertTimetoApproxMinutes(o[j]["dep_dt" == c ? "dd" : "ad"] + " " + o[j]["dep_dt" == c ? "dt" : "at"], this.modFilterData[c].earliest);
                        if (n > h + (l + 1) * i) break;
                        d[l].push(o[j].farepr);
                    }
            return d;
        },
        updateFilterWithConvFee: function () {
            if (void 0 !== this.convFeeType || void 0 !== this.convFee) {
                var a = this.convFee;
                "P" == this.convFeeType
                    ? ((this.modFilterData.pr.value[0] = Math.floor((this.formattedFilterData.pr.value[0] * a) / 100 + 1 * this.formattedFilterData.pr.value[0])),
                      (this.modFilterData.pr.minPrice = Math.floor((this.formattedFilterData.pr.minPrice * a) / 100 + 1 * this.formattedFilterData.pr.minPrice)),
                      (this.modFilterData.pr.value[1] = Math.ceil((this.formattedFilterData.pr.value[1] * a) / 100 + 1 * this.formattedFilterData.pr.value[1])),
                      (this.modFilterData.pr.maxPrice = Math.ceil((this.formattedFilterData.pr.maxPrice * a) / 100 + 1 * this.formattedFilterData.pr.maxPrice)))
                    : ((this.modFilterData.pr.value[0] = Math.floor(a + 1 * this.formattedFilterData.pr.value[0])),
                      (this.modFilterData.pr.minPrice = Math.floor(a + 1 * this.formattedFilterData.pr.minPrice)),
                      (this.modFilterData.pr.value[1] = Math.ceil(a + 1 * this.formattedFilterData.pr.value[1])),
                      (this.modFilterData.pr.maxPrice = Math.ceil(a + 1 * this.formattedFilterData.pr.maxPrice)));
            }
        },
        updateFilterIntlWithConvFee: function () {
            if (void 0 !== this.convFeeType || void 0 !== this.convFee) {
                var a = this.convFeeType,
                    b = this.convFee;
                for (var c in this.intlModFilters)
                    "P" == a
                        ? ((this.intlModFilters[c].pr.value[0] = Math.floor((this.intlFormattedFilters[c].pr.value[0] * b) / 100 + parseInt(this.intlFormattedFilters[c].pr.value[0]))),
                          (this.intlModFilters[c].pr.minPrice = Math.floor((this.intlFormattedFilters[c].pr.minPrice * b) / 100 + parseInt(this.intlFormattedFilters[c].pr.minPrice))),
                          (this.intlModFilters[c].pr.value[1] = Math.ceil((this.intlFormattedFilters[c].pr.value[1] * b) / 100 + parseInt(this.intlFormattedFilters[c].pr.value[1]))),
                          (this.intlModFilters[c].pr.maxPrice = Math.ceil((this.intlFormattedFilters[c].pr.maxPrice * b) / 100 + parseInt(this.intlFormattedFilters[c].pr.maxPrice))))
                        : ((this.intlModFilters[c].pr.value[0] = Math.floor(b + parseInt(this.intlFormattedFilters[c].pr.value[0]))),
                          (this.intlModFilters[c].pr.minPrice = Math.floor(b + parseInt(this.intlFormattedFilters[c].pr.minPrice))),
                          (this.intlModFilters[c].pr.value[1] = Math.ceil(b + parseInt(this.intlFormattedFilters[c].pr.value[1]))),
                          (this.intlModFilters[c].pr.maxPrice = Math.ceil(b + parseInt(this.intlFormattedFilters[c].pr.maxPrice))));
            }
        },
        updateConvFee: function (a, b) {
            var c = "";
            if (((this.convFeeType = a), (this.convFee = b), void 0 !== a || void 0 !== b))
                if ("I" == this.flightType || ("R" == this.searchType && "M" == this.searchType)) {
                    var d = JSON.parse(JSON.stringify(this.origResults));
                    for (var e in this.intlResultsValues)
                        (c = this.intlResultsValues[e].origfarepr),
                            void 0 === c && (c = this.intlResultsValues[e].origfarepr = this.intlResultsValues[e].farepr),
                            "P" === a && this.intlResultsValues[e].fare
                                ? ((this.intlResultsValues[e].farepr = (c * b) / 100 + 1 * c),
                                  (this.intlResultsValues[e].fare.convenience_fee = { name: "Convenience Fee", value: (c * b) / 100 }),
                                  (d[this.intlResultsValues[e].fk].farepr = (c * b) / 100 + 1 * c),
                                  (d[this.intlResultsValues[e].fk].fare.convenience_fee = { name: "Convenience Fee", value: (c * b) / 100 }))
                                : this.intlResultsValues[e].fare &&
                                  ((this.intlResultsValues[e].farepr = b + 1 * c),
                                  (this.intlResultsValues[e].fare.convenience_fee = { name: "Convenience Fee", value: b }),
                                  (d[this.intlResultsValues[e].fk].farepr = b + parseInt(c)),
                                  (d[this.intlResultsValues[e].fk].fare.convenience_fee = { name: "Convenience Fee", value: b }));
                    this.superResults.rdet = d;
                } else {
                    (this.formattedResults.taxes.CONV = "Convenience Fee"), (this.taxes.CONV = "Convenience Fee");
                    for (var f in this.formattedResults)
                        for (var e in this.formattedResults[f])
                            (c = this.formattedResults[f][e].origfarepr),
                                void 0 === c && (c = this.formattedResults[f][e].origfarepr = this.formattedResults[f][e].farepr),
                                "P" === a && this.formattedResults[f][e].fare
                                    ? ((this.formattedResults[f][e].farepr = (c * b) / 100 + 1 * c), (this.formattedResults[f][e].fare.convenience_fee = { name: "Convenience Fee", value: (c * b) / 100 }))
                                    : this.formattedResults[f][e].fare && ((this.formattedResults[f][e].farepr = b + 1 * c), (this.formattedResults[f][e].fare.convenience_fee = { name: "Convenience Fee", value: b }));
                }
        },
        applyHumaneSortScore: function () {
            var a = this,
                b = -1,
                c = -1;
            for (var d in a.origResults) {
                -1 === b ? (b = 1 * a.origResults[d].farepr) : b > 1 * a.origResults[d].farepr && (b = 1 * a.origResults[d].farepr);
                var e = a.arraySum(a.origResults[d].tt);
                -1 === c ? (c = e) : c > e && (c = e);
            }
            a.generateHumaneSortScore(a.origResults, b, c);
        },
        generateHumaneSortScore: function (a, b, c) {
            var d = -1;
            for (var e in a) {
                var f = 0;
                is.Empty(a[e].org_hscore) && (a[e].org_hscore = a[e].humane_score);
                var g = {};
                try {
                    (g = { calc: a[e].humane_price.total + " / " + b + " * 1200", formula: "total_price / minFare * 1200", total_price_calc: {} }),
                        is.Empty(a[e].humane_price) ||
                            is.Empty(a[e].humane_price.breakup) ||
                            is.Empty(a[e].humane_price.breakup.org_price) ||
                            ((g.total_price_calc.original_price = a[e].humane_price.breakup.org_price), is.Empty(a[e].humane_price.calc) || (g.total_price_calc.ft = a[e].humane_price.calc.ft));
                } catch (a) {}
                var h = (a[e].humane_price.total / b) * 1200,
                    i = (this.arraySum(a[e].tt) / c) * 1e3;
                (f += h + i),
                    (a[e].humane_score = 1 * a[e].org_hscore + 1 * f),
                    -1 === d ? (d = a[e].humane_score) : a[e].humane_score < d && (d = a[e].humane_score),
                    is.Empty(a[e].humane_arr) || ((a[e].humane_arr.price = h.toFixed(2)), (a[e].humane_arr.price_calc = g), (a[e].humane_arr.duration = i.toFixed(2)));
            }
            for (var j in a) (a[j].aht = a[j].humane_score > d * this.humaneThreshold ? 1 : 0), (a[j].cheapest = a[j].farepr == b), (a[j].fastest = this.arraySum(a[j].tt) == c);
        },
        getIntlLegObjForFK: function (a) {
            var b = this.origResults[a].leg,
                c = [];
            for (var d in b) {
                c.push(JSON.parse(JSON.stringify(this.intlResultsLegsObj[b[d]]))), (c[c.length - 1].farepr = this.origResults[a].farepr), (c[c.length - 1].fk = this.origResults[a].fk), (c[c.length - 1].cc = this.origResults[a].cc);
                for (var e in c[c.length - 1].flights) c[c.length - 1].flights[e] = JSON.parse(JSON.stringify(this.intlResultsFlightsObj[c[c.length - 1].flights[e]]));
            }
            return c;
        },
        arraySum: function (a) {
            if (is.Empty(a)) return 0;
            if (is.Array(a)) {
                var b = 0;
                for (var c in a) b += 1 * a[c];
                return b;
            }
            return is.String(a) || is.Number(a) ? parseFloat(a) : 0;
        },
        updateRefundableStatus: function (a, b) {
            if ("I" == this.flightType && "S" != this.searchType) for (var c in this.origResults) this.origResults[c].fk == a && ((this.origResults[c].rfd = b), (this.origResults[c].rfd_updated = !0));
            else
                this.formattedResults.RF.map(function (c) {
                    c.fk == a && ((c.rfd = b), (c.rfd_updated = !0));
                }),
                    this.applyFilters();
        },
        getAllPinnedFks: function (a) {
            var b = [],
                c = this;
            return (
                a.map(function (a) {
                    var d = c.getResultsHavingFkey(a);
                    d.hasCorpFare ? b.push([a, d.corpFk]) : d.ofk && d.ofk !== d.fk ? b.push([a, d.ofk]) : b.push([a]);
                }),
                b
            );
        },
    };
}),
    _define_({ name: "at.tripservice", modules: ["jQuery", "jsutils.file", "at.dataservice"] }, function (a, b, c, d) {
        var e = function (a) {
                var c = b.extend(!0, { type: "post", dataType: "json" }, a);
                return b.ajax(c);
            },
            f = _module_("at.common.functions"),
            g = f.getAPIServiceUrl();
        (a.getList = function () {
            return b.ajax({ url: g + "/trips/list", type: "get", dataType: "jsonp", cache: !1 });
        }),
            (a.addTrip = function (a) {
                return e({ url: g + "/trips/add", data: b.param(a) });
            }),
            (a.editTrip = function (a) {
                return e({ url: g + "/trips/edit", data: b.param(a) });
            }),
            (a.getTripList = function (a) {
                return b.ajax({ url: g + "/trips/owned", type: "get", data: b.param(a), dataType: "jsonp", cache: !1 });
            }),
            (a.duplicateTrip = function (a) {
                return e({ url: g + "/trips/duplicate", data: b.param(a) });
            }),
            (a.deleteTrip = function (a) {
                return e({ url: g + "/trips/delete", data: b.param(a) });
            }),
            (a.restoreTrip = function (a) {
                return e({ url: g + "/trips/restore", data: b.param(a) });
            }),
            (a.mergeTrips = function (a) {
                return e({ url: g + "/trips/merge", data: b.param(a) });
            }),
            (a.markDefaultTrip = function (a) {
                return e({ url: g + "/trips/default", data: b.param(a) });
            }),
            (a.emptyTrips = function (a) {
                return e({ url: g + "/trips/purge", data: b.param(a) });
            }),
            (a.grantTripRights = function (a) {
                return e({ url: g + "/trips/share/add", data: b.param(a) });
            }),
            (a.updateRights = function (a) {
                return e({ url: g + "/trips/share/edit", data: b.param(a) });
            }),
            (a.deleteSharedUser = function (a) {
                return e({ url: g + "/trips/share/delete", data: b.param(a) });
            }),
            (a.getEvents = function (a) {
                return b.ajax({ url: g + "/trips/events", type: "get", data: b.param(a), dataType: "json" });
            }),
            (a.getMETA = function () {
                return b.ajax({ url: g + "/users/meta", type: "get", dataType: "json" });
            }),
            (a.getNotes = function (a) {
                return b.ajax({ url: g + "/trips/notes", type: "get", data: b.param(a), dataType: "jsonp" });
            }),
            (a.addNotes = function (a) {
                return e({ url: g + "/trips/note/add", data: b.param(a) });
            }),
            (a.editNotes = function (a) {
                return e({ url: g + "/trips/note/edit", data: b.param(a) });
            }),
            (a.deleteNotes = function (a) {
                return e({ url: g + "/trips/note/delete", data: b.param(a) });
            }),
            (a.addAlarm = function (a) {
                return e({ url: g + "/trips/alert/add", data: b.param(a) });
            }),
            (a.editAlarm = function (a) {
                return e({ url: g + "/trips/alert/edit", data: b.param(a) });
            }),
            (a.deleteAlarm = function (a) {
                return e({ url: g + "/trips/alert/delete", data: b.param(a) });
            }),
            (a.updateAlarmStatus = function (a) {
                return e({ url: g + "/trips/alert/status/update", data: b.param(a) });
            }),
            (a.getEventDetails = function (a) {
                return b.ajax({ url: g + "/trips/event/details", type: "get", data: b.param(a), dataType: "jsonp" });
            }),
            (a.getFlightsInfo = function () {
                return c.getJSON(this.path("at.tripsFlightsInfo.json"));
            }),
            (a.addEditEvent = function (a, c, d) {
                var f = g + "/trips/event/" + a + "/" + c;
                return e(void 0 !== d.append ? { url: f, data: d, cache: !1, processData: !1, contentType: !1 } : { url: f, data: b.param(d) });
            }),
            (a.copyEvents = function (a) {
                return e({ url: g + "/trips/event/copy", data: b.param(a) });
            }),
            (a.moveEvents = function (a) {
                return e({ url: g + "/trips/event/move", data: b.param(a) });
            }),
            (a.makeEventsPrivate = function (a) {
                return e({ url: g + "/trips/event/private", data: b.param(a) });
            }),
            (a.deleteEvent = function (a) {
                return e({ url: g + "/trips/event/delete", data: b.param(a) });
            }),
            (a.undoDeleteEvent = function (a) {
                return e({ url: g + "/trips/event/delete/undo", data: b.param(a) });
            }),
            (a.alertEvents = function (a) {
                return e({ url: g + "/trips/event/alert", data: b.param(a) });
            }),
            (a.alertAllEvents = function (a) {
                return e({ url: g + "/trips/alert", data: b.param(a) });
            }),
            (a.getFlightStatus = function (a) {
                var c = g + "/trips/flight-status";
                return b.ajax({ url: c, type: "get", data: b.param(a), dataType: "jsonp" });
            }),
            (a.getFlightDelayIndex = function (a) {
                var c = g + "/flights/delay-index";
                return (a.GET = ""), b.ajax({ url: c, type: "get", data: b.param(a), dataType: "jsonp" });
            }),
            (a.getGeoData = function (a) {
                var c = g + "/trips/autocomplete/details";
                return b.ajax({ url: c, type: "get", data: b.param(a), dataType: "jsonp", cache: !1 });
            }),
            (a.saveToTrips = function (a, c) {
                return e({ url: g + "/trips/event/" + a + "/save", data: b.param(c) });
            }),
            (a.populateAirline = function (a) {
                var c = g + "/airlines/search";
                return b.ajax({ url: c, type: "get", data: b.param(a), dataType: "jsonp", cache: !1 });
            }),
            (a.populateAirport = function (a) {
                var c = g + "/airports/search?is_metro=0";
                return b.ajax({ url: c, type: "get", data: b.param(a), dataType: "jsonp", cache: !1 });
            }),
            (a.getUserLocation = function () {
                return b.ajax({ url: g + "/hotels/location", type: "GET", cache: !1, dataType: "json" });
            }),
            (a.lockTrip = function (a) {
                return e({ url: g + "/trips/locked", data: b.param(a) });
            }),
            (a.getCountries = function () {
                return b.ajax({ url: g + "/country/list", type: "GET", cache: !1, dataType: "json" });
            }),
            (a.getTimezoneList = function () {
                return b.ajax({ url: g + "/timezones/list", type: "GET", cache: !1, dataType: "json" });
            }),
            (a.getCurrencies = function () {
                return b.ajax({ url: g + "/currencies/list", type: "GET", cache: !1, dataType: "json" });
            }),
            (a.checkAirportsIATA = function (a) {
                return d.ajax("checkAirportsIATA", "GET", a);
            });
    }),
    define({ name: "at.trips.common", extend: "spamjs.view.extended", modules: ["spamjs.modal", "jQuery", "_", "jqbus", "moment", "at.tripservice", "at.common.functions"] }).as(function (a, b, c, d, e, f, g, h) {
        return (
            (function (a) {
                var b = a.inArray;
                (a.inArray = function () {
                    return isNaN(arguments[0]) || (arguments[0] = parseInt(arguments[0])), b.apply(this, arguments);
                }),
                    a("body").delegate(".css-footer .css-top-logo", "click", function () {
                        c("body,html").animate({ scrollTop: 0 }, "slow");
                    });
            })(jQuery),
            {
                TRIP_NAME_LIMIT: 20,
                USER_RIGHTS: { OWNER: 1, VIEW: 0, EDIT: 2 },
                ALERT: { OFF: 0, ON: 1, MANUAL: 2 },
                timePickerOptions: { minuteStep: 5, snapToStep: !0, defaultTime: "current", icons: { up: "icon icon_arrow-up", down: "icon icon_arrow-down" } },
                googleMapsLoaded: !1,
                currentEvent: "",
                timeLeft: function (a) {
                    var b = f(f().format("YYYY-MM-DD")),
                        c = f(a).diff(b, "days"),
                        d = {};
                    if (c < 61) d = { label: c, text: "day" + (c > 1 ? "s" : "") };
                    else if (c >= 61 && c < 1826) {
                        var e = Math.floor(f(a).diff(b, "months", !0));
                        d = { label: e, text: "month" + (e > 1 ? "s" : "") };
                    } else {
                        var g = Math.floor(f(a).diff(b, "years", !0));
                        d = { label: g, text: "year" + (g > 1 ? "s" : "") };
                    }
                    return d;
                },
                timeAgo: function (a) {
                    var b = f(f().format("YYYY-MM-DD")),
                        c = b.diff(f(a), "days"),
                        d = {};
                    if ((c = Math.abs(c)) < 61) d = { label: c, text: "day" + (c > 1 ? "s" : "") };
                    else if (c >= 61 && c < 1826) {
                        var e = Math.floor(b.diff(f(a), "months", !0));
                        d = { label: e, text: "month" + (e > 1 ? "s" : "") };
                    } else {
                        var g = Math.floor(b.diff(f(a), "years", !0));
                        d = { label: g, text: "year" + (g > 1 ? "s" : "") };
                    }
                    return d;
                },
                getCountryHTML: function () {
                    var a = '<option value="">Select Country</option>',
                        b = this.getCountryArray();
                    for (var c in b) a += '<option value="' + b[c].code + '">' + b[c].label + " </option>";
                    return a;
                },
                getTimeZoneLabel: function (a) {
                    if ("automatic" != a.toLowerCase()) {
                        var b = a.split("_"),
                            c = this.getTimeZoneArray();
                        for (var d in c) for (var e in c[d]) if (c[d][e].short_name == b[0] && c[d][e].offset == b[1]) return c[d][e].label + " - " + c[d][e].offset + " (" + c[d][e].short_name + ")";
                    }
                    return "Automatic";
                },
                getTimeZoneArray: function () {
                    if (void 0 === this.timezoneArray || is.Empty(this.timezoneArray)) {
                        this.timezoneArray = [];
                        var a = this;
                        g.getTimezoneList().done(function (b) {
                            b.success && (a.timezoneArray = _.groupBy(b.data, "display_group"));
                        });
                    }
                    return this.timezoneArray;
                },
                getCountryArray: function () {
                    if (void 0 === this.countryArray || is.Empty(this.countryArray)) {
                        this.countryArray = [];
                        var a = this;
                        g.getCountries().done(function (b) {
                            if (b.success) {
                                a.countryAssocArray = b.data;
                                for (var c in b.data) a.countryArray.push({ label: b.data[c], code: c });
                            }
                        });
                    }
                    return this.countryArray;
                },
                getCurrencyArray: function () {
                    var a = this;
                    return (
                        (void 0 === a.currencyArray || is.Empty(a.currencyArray)) &&
                            ((a.currencyArray = []),
                            g.getCurrencies().done(function (b) {
                                b.success && (a.currencyArray = b.data);
                            })),
                        a.currencyArray
                    );
                },
                getCurrencyHTML: function () {
                    var a = "",
                        b = this.getCurrencyArray(),
                        c = {};
                    for (var d in b) void 0 === c[b[d].group] && (c[b[d].group] = {}), (c[b[d].group][d] = b[d]);
                    for (var e in c) {
                        a += " <optgroup label=''>";
                        for (var d in c[e]) {
                            a +=
                                '<option value="' +
                                d +
                                '" class="css-currencies-box" data-content="<span class=\'css-currency-ico\'>' +
                                h.format.amount("0", d, "json").symbolTag.replace(/["]/g, "'") +
                                "</span><span class='css-currency-code'>" +
                                d +
                                "</span><span>" +
                                b[d].name +
                                '</span>" title="' +
                                d +
                                " - " +
                                b[d].name +
                                '">' +
                                b[d].name +
                                "</option>";
                        }
                        a += "</optgroup>";
                    }
                    return a;
                },
                getTimeZoneHTML: function () {
                    var a = "",
                        b = this.getTimeZoneArray(),
                        c = '<optgroup label=""><option value="Automatic">Automatic</option></optgroup>';
                    for (var d in b) {
                        is.Empty(c) || ((a += c), (c = "")), (a += '<optgroup label="' + ("primary" == d ? "Popular Timezones" : "All Timezones") + '">');
                        for (var e in b[d]) "" !== b[d][e][1] && (a += '<option value="' + b[d][e].short_name + "_" + b[d][e].offset + '">' + b[d][e].offset + " - " + b[d][e].label + " (" + b[d][e].short_name + ") </option>");
                        a += "</optgroup>";
                    }
                    return a;
                },
                getDateDisplayFormat: function () {
                    return h.getDateDisplayFormat();
                },
                showTripList: function (a, d, e, f, i, j) {
                    var k = c.Deferred(),
                        l = "",
                        m = !1,
                        n = this;
                    "trips" == f ? ((l = i.ucwords() + ' "' + e + '" to'), (m = !1)) : "events" == f && ((l = j.eventIDArray.length + " " + h.addApostrophe(j.eventIDArray.length, "event") + " selected from " + e), (m = !0));
                    var o = b.instance({ src: "trips/at.trips.popover.merge.html", data: { caption: l, tripName: e, buttonLabel: i.ucfirst(), showNewTrip: m, showMessage: !0 } }),
                        p = i + f.ucfirst();
                    return (
                        a.add("#myModal", o).done(function () {
                            var b = $("#myModal");
                            b.on("hidden.bs.modal", function () {
                                c(this).closest("view").remove();
                            }),
                                g
                                    .getTripList({ trip_id: d })
                                    .done(function (e) {
                                        if (e.success)
                                            if (void 0 !== e.data) {
                                                var l = c(document.createDocumentFragment());
                                                for (var m in e.data) l.append(c("<li/>", { "data-tripid": e.data[m].id, class: "" }).html('<i class="icon icon_checkmark"></i>' + e.data[m].name));
                                                b.find("ul").html(l), b.find(".no_data-js, .loader-js").hide().end().find("ul").show(), a.perfectScrollbar(b.find(".c-scroll")).init();
                                            } else k.resolve(!1), b.find("ul, .loader-js").hide().end().find(".no_data-js").show();
                                        else b.find("ul, .loader-js").hide().end().find(".no_data-js").show(), k.resolve(!1);
                                        b.find(".css-move-button span").on("click", function () {
                                            var a = c(this);
                                            if (a.find("button").length > 0) {
                                                var e = b.find(".css-movenew-trip-popup li[data-selected]");
                                                if (e.length > 0) {
                                                    b.find("button").attr({ disabled: "disabled" }).addClass("loading").removeClass("fill");
                                                    var h = [];
                                                    if (
                                                        (e.each(function () {
                                                            h.push(c.trim(c(this).attr("data-tripid")));
                                                        }),
                                                        (e = null),
                                                        h.length > 0)
                                                    ) {
                                                        var l = { trip_id: d, is_delete: "1" };
                                                        "events" == f && (l.event_id = j.eventIDArray), "copy" == i ? (l.copy_id = h) : "move" == i ? (l.move_id = h) : "merge" == i && (l.merge_id = h);
                                                        var m = b.find(".css-movenew-trip-popup li");
                                                        m.attr("data-disabled", "true"),
                                                            g[p](l)
                                                                .done(function (a) {
                                                                    m.removeAttr("data-disabled"), b.modal("hide"), $(".modal-backdrop").fadeOut(), c("body").removeClass("modal-open"), k.resolve(a.success, a.data);
                                                                })
                                                                .fail(function () {
                                                                    m.removeAttr("data-disabled"), b.modal("hide"), c("body").removeClass("modal-open"), k.resolve(!1);
                                                                });
                                                    }
                                                }
                                            } else b.modal("hide");
                                            a.off("click");
                                        }),
                                            b.delegate(".css-movenew-trip-popup li", "click", function () {
                                                var a = c(this);
                                                void 0 !== a.attr("data-selected") ? a.removeAttr("data-selected").removeClass("css-active") : void 0 === a.attr("data-disabled") && a.attr("data-selected", "true").addClass("css-active"),
                                                    "move" == i && a.siblings().removeAttr("data-selected").removeClass("css-active");
                                                var b = c(this).parent();
                                                b.find("li[data-selected]").length > 0
                                                    ? b.closest(".css-move-mid-cont").next().find("button").removeAttr("disabled")
                                                    : b.closest(".css-move-mid-cont").next().find("button").attr("disabled", "disabled"),
                                                    (b = null);
                                            }),
                                            b.find(".css-movenew-trip-popup .add-new-trip-popup-js").on("click", function () {
                                                var a = c(this).closest(".css-movenew-trip-popup").find(".add-new-trip-input-js");
                                                a.show()
                                                    .find("input")
                                                    .on("keypress", function (a) {
                                                        13 === a.keyCode && $(this).siblings(".css-add-new-trip-input-actions").find(".add").trigger("click");
                                                    })
                                                    .focus()
                                                    .end()
                                                    .find(".add")
                                                    .on("click", function (b) {
                                                        b.stopPropagation();
                                                        var d = c(this);
                                                        if (void 0 !== d.attr("data-disabled")) return !1;
                                                        var e = d.parent().prev(),
                                                            f = c.trim(e.val());
                                                        if (f.length > 0) {
                                                            if (f.length > 20) return void h.alert.show("Please enter a trip name upto " + n.TRIP_NAME_LIMIT + " characters.", "error");
                                                            d.attr("data-disabled", "true"),
                                                                e.attr({ readonly: "readonly" }),
                                                                d.hide().next().hide().next().show(),
                                                                g
                                                                    .addTrip({ name: f })
                                                                    .done(function (b) {
                                                                        if (b.success) {
                                                                            if (void 0 !== b.data[0].id) {
                                                                                d.off("click"), e.val("").parent().removeClass("error");
                                                                                a.hide()
                                                                                    .closest(".css-move-mid-cont")
                                                                                    .find("ul")
                                                                                    .prepend('<li data-tripid="' + b.data[0].id + '"><i class="icon icon_checkmark"></i>' + f + "</li>")
                                                                                    .find("li:nth-child(1)")
                                                                                    .trigger("click");
                                                                            }
                                                                        } else is.Empty(b.errors) || (e.parent().addClass("error"), c.inArray(121, b.errors) > -1 && h.alert.show("A trip with same name already exists. Please add new trip name."));
                                                                        d.show().next().show().next().hide(), d.removeAttr("data-disabled"), e.removeAttr("readonly");
                                                                    })
                                                                    .fail(function () {
                                                                        d.show().next().show().next().hide(), d.removeAttr("data-disabled"), e.removeAttr("readonly").val("").parent().removeClass("error");
                                                                    });
                                                        } else e.parent().addClass("error");
                                                    })
                                                    .next(".cancel")
                                                    .on("click", function (b) {
                                                        b.stopPropagation(), c(this).off("click"), c(this).prev().prev().val("").parent().removeClass("error"), a.hide();
                                                    });
                                            }),
                                            0 == e.data.length && b.find(".add-new-trip-popup-js").click();
                                    })
                                    .fail(function () {});
                        }),
                        k.promise()
                    );
                },
                grantTripRights: function (a, b, e) {
                    var f = a.find("input.share-email"),
                        i = a.find("input.share-message"),
                        j = a.find("select.share-rights"),
                        k = c.trim(f.val()),
                        l = c.trim(i.val()),
                        m = c.trim(j.find("option:selected").val()),
                        n = k.split(",");
                    n = d.uniq(n, function (a) {
                        return c.trim(a);
                    });
                    var o = h.validator(),
                        p = !0;
                    f.parent().removeClass("error").next().hide(), j.parent().removeClass("error").next().hide();
                    var q = a.find('input[type="submit"]');
                    for (var r in n) {
                        var s = c.trim(n[r]);
                        if (!o.email(s)) {
                            f
                                .parent()
                                .addClass("error")
                                .next()
                                .html("Please provide valid email id" + (n.length > 1 ? "'s" : ""))
                                .show(),
                                (p = !1);
                            break;
                        }
                    }
                    if (("0" != m && "2" != m && (j.parent().addClass("error").next().html("Please provide valid trip rights.").show(), (p = !1)), p)) {
                        a.find(".error").removeClass(".error").end().find(".css-error-msgs").hide();
                        var t = [],
                            u = { trip_id: e, message: l, rights: m, email: [] };
                        for (var r in n) u.email.push(c.trim(n[r])), t.push({ email: c.trim(n[r]), rights: m });
                        q.attr({ disabled: "disabled" }).removeClass("fill").addClass("loading"),
                            g
                                .grantTripRights(u)
                                .done(function (d) {
                                    d.success
                                        ? (a.get(0).reset(),
                                          b.clone("at.trips.share.list.html", t).done(function (b) {
                                              a.parent().prev().append(b), h.selectpicker(b.find("select")).init({ parent: self });
                                          }),
                                          a.find("select.share-rights").selectpicker("refresh"),
                                          h.alert.show("Trip has been shared successfully", "success"))
                                        : c.inArray("2", d.errors) > -1
                                        ? h.alert.show("please provide a valid trip id")
                                        : c.inArray("15", d.errors) > -1 || c.inArray("19", d.errors) > -1
                                        ? (a.find("input.share-email").parent().addClass("error"), h.alert.show("Please provide a valid email id"))
                                        : c.inArray("18", d.errors) > -1
                                        ? h.alert.show("Please provide valid trip rights")
                                        : c.inArray("20", d.errors) > -1
                                        ? (a.find("input.share-email").parent().addClass("error"), h.alert.show("Email id already exists. Please provide another Email id."))
                                        : c.inArray("21", d.errors) > -1 && (a.find("input.share-email").parent().addClass("error"), h.alert.show("Trip owner cannot share the trip to oneself.")),
                                        q.removeAttr("disabled").removeClass("loading").addClass("fill");
                                })
                                .fail(function () {
                                    q.removeAttr("disabled").removeClass("loading").addClass("fill");
                                });
                    }
                },
                editTripRights: function (a, b) {
                    var d = c.trim(a.find("option:selected").val()),
                        e = c.trim(a.attr("data-email"));
                    if ((a.parent().removeClass("error"), "0" == d || "2" == d)) {
                        a.attr("disabled", "disabled");
                        var f = { trip_id: b, rights: d, email: e };
                        g.updateRights(f)
                            .done(function (b) {
                                b.success
                                    ? h.alert.show("Trip has been shared successfully", "success")
                                    : c.inArray("2", b.errors) > -1
                                    ? h.alert.show("please provide a valid trip id")
                                    : c.inArray("15", b.errors) > -1 || c.inArray("19", b.errors) > -1
                                    ? h.alert.show("Please provide a valid email id")
                                    : c.inArray("18", b.errors) > -1 && h.alert.show("Please provide valid trip rights"),
                                    a.removeAttr("disabled");
                            })
                            .fail(function () {
                                a.removeAttr("disabled");
                            });
                    } else a.parent().addClass("error");
                },
                deleteTripRights: function (a) {
                    var b = c.trim($select.attr("data-email"));
                    if ("0" == tripRight || "2" == tripRight) {
                        $select.attr("disabled", "disabled");
                        var d = { trip_id: a, rights: tripRight, email: b };
                        g.updateRights(d)
                            .done(function (a) {
                                a.success ||
                                    (c.inArray("2", a.errors) > -1
                                        ? h.alert.show("please provide a valid trip id")
                                        : c.inArray("15", a.errors) > -1 || c.inArray("19", a.errors) > -1
                                        ? h.alert.show("Please provide a valid email id")
                                        : c.inArray("18", a.errors) > -1 && h.alert.show("Please provide valid trip rights")),
                                    $select.removeAttr("disabled");
                            })
                            .fail(function () {
                                $select.removeAttr("disabled");
                            });
                    } else $select.parent().addClass("error");
                },
                saveTripsAsPDF: function (a, b) {
                    if (!is.Empty(a)) {
                        var c = "//" + window.location.hostname + "/downloads/trips/pdf/" + a + "/" + b + "-" + a + "-Aertrip.pdf";
                        window.open(c, "_blank");
                    }
                },
                calenderSync: function (a, d) {
                    if (!isNaN(d.tripID) && 0 != d.tripID && "" != d.tripName) {
                        var e = b.instance({ src: "trips/at.trips.popover.calender-sync.html", data: d });
                        a.add("#myModal", e),
                            e.done(function () {
                                var a = c("#myModal");
                                h.bindZeroClipboard(a.find(".css-trips-cal-sync-popup .copy-text-js").get(0)),
                                    a.on("hidden.bs.modal", function () {
                                        c(this).parent().remove();
                                    });
                            });
                    }
                },
                getDuration: function (a, b) {
                    var c = f(b).diff(f(a)),
                        d = f.duration(c);
                    return Math.floor(d.asHours()) + "h " + f.utc(c).format("mm") + "m";
                },
                makeTimeArray: function () {
                    var a,
                        b,
                        c = [];
                    for (a = 0; a < 24; a++)
                        for (b = 0; b < 2; b++) {
                            var d = a > 9 ? 0 : "0";
                            c.push(d + a + ":" + (0 === b ? "00" : 30 * b));
                        }
                    return c;
                },
                updatePhone: function (a, b) {
                    var d = c(b).attr("class").indexOf("country-list") > -1 ? c(b).closest(".textInput").find('input[type="text"]') : c(b);
                    if (h.intlTelInput(d, "isValidNumber")) {
                        var e = h.intlTelInput(d, "getNumber"),
                            f = b.selectionStart,
                            g = b.selectionEnd;
                        d.val(d.val().replace(e.isd, "").trim()).trigger("input"), b.setSelectionRange(f, g), d.closest(".textInput").find('input[type="hidden"]').val(e.isd).trigger("input");
                    }
                },
                displayTripList: function (a) {
                    var d = c.Deferred(),
                        e = b.instance({ src: "trips/at.trips.popover.merge.html", data: { caption: "Select trip from the following list", buttonLabel: "Save to Trip", showNewTrip: !0 } });
                    return (
                        a.add("#myModal", e).done(function () {
                            var b = $("#myModal");
                            b.on("hidden.bs.modal", function () {
                                c(this).closest("view").remove();
                            }),
                                g
                                    .getTripList({ trip_id: tripID })
                                    .done(function (e) {
                                        if (e.success)
                                            if (void 0 !== e.data)
                                                if (e.data.length > 0) {
                                                    var f = c(document.createDocumentFragment());
                                                    for (var h in e.data) f.append(c("<li/>", { "data-tripid": e.data[h].id, class: "" }).html('<i class="icon icon_checkmark"></i>' + e.data[h].name));
                                                    b.find("ul").html(f), b.find(".no_data-js, .loader-js").hide().end().find("ul").show(), a.perfectScrollbar(b.find(".c-scroll")).init();
                                                } else d.resolve(!1);
                                            else d.resolve(!1), b.find("ul, .loader-js").hide().end().find(".no_data-js").show();
                                        else b.find("ul, .loader-js").hide().end().find(".no_data-js").show(), d.resolve(!1);
                                        b.delegate(".css-movenew-trip-popup li", "click", function () {
                                            var a = c(this);
                                            void 0 !== a.attr("data-selected") ? a.removeAttr("data-selected").removeClass("css-active") : void 0 === a.attr("data-disabled") && a.attr("data-selected", "true").addClass("css-active");
                                            var b = c(this).parent();
                                            b.find("li[data-selected]").length > 0
                                                ? b.closest(".css-move-mid-cont").next().find("button").removeAttr("disabled")
                                                : b.closest(".css-move-mid-cont").next().find("button").attr("disabled", "disabled"),
                                                (b = null);
                                        }),
                                            b.find(".css-movenew-trip-popup .add-new-trip-popup-js").on("click", function () {
                                                var a = c(this).closest(".css-movenew-trip-popup").find(".add-new-trip-input-js");
                                                a.show()
                                                    .find("input")
                                                    .on("keypress", function (a) {
                                                        13 === a.keyCode && $(this).siblings(".css-add-new-trip-input-actions").find(".add").trigger("click");
                                                    })
                                                    .focus()
                                                    .end()
                                                    .find(".add")
                                                    .on("click", function (b) {
                                                        b.stopPropagation();
                                                        var d = c(this);
                                                        if (void 0 !== d.attr("data-disabled")) return !1;
                                                        var e = d.parent().prev(),
                                                            f = c.trim(e.val());
                                                        f.length > 0
                                                            ? (d.attr("data-disabled", "true"),
                                                              e.attr({ readonly: "readonly" }),
                                                              d.hide().next().hide().next().show(),
                                                              g
                                                                  .addTrip({ name: f })
                                                                  .done(function (b) {
                                                                      b.success
                                                                          ? void 0 !== b.data[0].id &&
                                                                            (d.off("click"),
                                                                            e.val("").parent().removeClass("error"),
                                                                            a
                                                                                .hide()
                                                                                .closest(".css-move-mid-cont")
                                                                                .find("ul")
                                                                                .prepend('<li data-tripid="' + b.data[0].id + '"><i class="icon icon_checkmark"></i>' + f + "</li>")
                                                                                .find("li:nth-child(1)")
                                                                                .trigger("click"))
                                                                          : is.Empty(b.errors) || e.parent().addClass("error"),
                                                                          d.show().next().show().next().hide(),
                                                                          d.removeAttr("data-disabled"),
                                                                          e.removeAttr("readonly");
                                                                  })
                                                                  .fail(function () {
                                                                      d.show().next().show().next().hide(), d.removeAttr("data-disabled"), e.removeAttr("readonly").val("").parent().removeClass("error");
                                                                  }))
                                                            : e.parent().addClass("error");
                                                    })
                                                    .next(".cancel")
                                                    .on("click", function (b) {
                                                        b.stopPropagation(), c(this).off("click"), c(this).prev().prev().val("").parent().removeClass("error"), a.hide();
                                                    });
                                            });
                                    })
                                    .fail(function () {});
                        }),
                        d.promise()
                    );
                },
                getTripRights: function (a) {
                    if (void 0 !== a && null == window.currentUserRights1) {
                        var b = _module_("at.login"),
                            c = b.getUserMeta().email,
                            d = _.findIndex(a, { email: c }),
                            e = d > -1 ? a[d].rights : 0;
                        window.currentUserRights1 = e;
                    }
                    return null == window.currentUserRights1 && (window.currentUserRights1 = 0), window.currentUserRights1;
                },
                deleteSharedUser: function (a, c, d, e) {
                    b.confirm(c, { title: "Are you sure you want to delete this shared user?", desc: "", buttonLabel: "Delete" }).done(function (b) {
                        if (b) {
                            var c = { trip_id: d, email: e };
                            g.deleteSharedUser(c)
                                .done(function (b) {
                                    b.success &&
                                        (a.closest(".manage-trips-name").slideUp(function () {
                                            $(this).remove();
                                        }),
                                        h.alert.show("Shared user has been deleted successfully", "success"));
                                })
                                .fail(function () {
                                    h.alert.show("There was some error processing your request. Please try again.", "success");
                                });
                        }
                    });
                },
                showRightPaneLoader: function () {
                    var a = c(this),
                        b = a.siblings(".right-pane-loader-js");
                    0 === b.length && ((b = c("<div/>", { class: "css-trips-right-pane-loader right-pane-loader-js", style: "display: none;" }).html(h.getLoaderHTML("large"))), a.parent().prepend(b)), b.show();
                },
                hideRightPaneLoader: function () {
                    c(this).siblings(".right-pane-loader-js").hide();
                },
                checkIfEmpty: function (a, b) {
                    var c = !0;
                    if (!is.Empty(arguments[0]))
                        for (var d in b)
                            if (void 0 !== a[b[d]] && !is.Empty(a[b[d]])) {
                                c = !1;
                                break;
                            }
                    return c;
                },
                lockTrip: function (a, b) {
                    tripservice.lockTrip({ trip_id: a, active: b }).done(function (a) {
                        a.success ? h.alert.show("Trip is locked successfully.", "success") : c.inArray("999", a.errors) > -1 && h.alert.show("You are not authorized to access this trip.");
                    });
                },
                calculateCharsLeft: function (a, b) {
                    return b - a.length;
                },
                characterCountText: function (a) {
                    return ["", a, ""].join("");
                },
                hideTimepickerWidget: function () {
                    c(".bootstrap-timepicker-widget").detach();
                },
                bindTooltipForEllipsis: function (a) {
                    a.find(".ellipsis-tooltip-js").each(function () {
                        h.addTooltipForEllipsis(this);
                    });
                },
                bindJqueryPlugins: function (a) {
                    var b = this,
                        d = a,
                        e = d.$$.find("input.timepicker");
                    e.each(function () {
                        c(this).closest(".textInput").attr("data-defaultvalue", c(this).val());
                    });
                    var f = e.parent().timepicker(b.timePickerOptions);
                    e.each(function () {
                        var a = c(this).closest(".textInput"),
                            b = a.data("defaultvalue");
                        if (is.Empty(b)) {
                            var d = a.val();
                            is.Empty(d) || (a.timepicker("setTime", d), c(this).val(d).trigger("input"));
                        } else a.timepicker("setTime", b), c(this).val(b).trigger("input");
                    }),
                        f
                            .on("changeTime.timepicker", function (a) {
                                var b = c(this).find("input").val(a.time.value).trigger("input").trigger("keyup");
                                b.valid(), b.closest(".css-date-feild").prev(".css-date-feild").find("input").trigger("keyup").valid();
                            })
                            .on("hide.timepicker", function () {
                                c(this).timepicker("setTime", c(this).find("input").val());
                            }),
                        (f = null),
                        (e = null),
                        d.$$.find(".phone").each(function () {
                            var a = c(this).closest(".textInput").find('input[type="hidden"]').val(),
                                b = c(this).val();
                            if (is.Empty(b)) h.intlTelInput(c(this));
                            else {
                                var d = h.intlTelInput("formatNumber", a, b);
                                h.intlTelInput(c(this)), h.intlTelInput(c(this), "setNumber", d);
                            }
                        }),
                        h.selectpicker(d.$$.find("select")).init({ parent: d });
                },
                getBookingUrlHTML: function (a) {
                    function b(a) {
                        a.indexOf("?") > -1 && (a = a.split("?")[1]), (a = a.split("+").join(" "));
                        for (var b, c = {}, d = /[?&]?([^=]+)=([^&]*)/g; (b = d.exec(a)); ) c[decodeURIComponent(b[1])] = decodeURIComponent(b[2]);
                        return c;
                    }
                    var a = a.indexOf("http") > -1 ? a : "//" + a,
                        c = "<a href='" + a + "' target='_blank'>" + a + "</a>";
                    if (a.indexOf("aertrip.com") > -1 && a.indexOf("bid=") > -1) {
                        c = "<a href='" + a + "' style='text-transform: none;' target='_blank'>Aertrip - " + b(a).bid + "</a>";
                    }
                    return c;
                },
                bindValidatorToShare: function (a, b) {
                    c.validator.setDefaults({ ignore: [] }),
                        a.validate({
                            submitHandler: function (a) {
                                return b(null, c(a), {}), !1;
                            },
                            errorPlacement: function (a, b) {
                                c(b).parent(".textInput").addClass("error").siblings(".css-error-msgs").html(a[0].innerHTML).show();
                            },
                            success: function (a, b) {
                                c(b).parent(".textInput").removeClass("error").siblings(".css-error-msgs").html("").hide();
                            },
                        }),
                        c.validator.addClassRules({ "share-email": { required: !0, emailCommaSeparated: !0 }, "share-message": { maxlength: 255, requiredWithTrim: !0 } });
                },
                onSharePopupOpen: function (a, b) {
                    a.find(".error").removeClass("error"), a.find(".css-error-msgs").hide(), a.find('input[type="text"]').val(""), this.bindValidatorToShare(a, b);
                },
                onSharePopupClose: function (a) {
                    a.unbind("validate");
                },
                displayFormattedPhone: function (a) {
                    var b = ["phone", "service_provider_phone", "operator_phone", "company_phone", "booking_phone"];
                    for (var c in a.details)
                        for (var d in b)
                            if (!is.Empty(a.details[c][b[d]])) {
                                var e = h.intlTelInput("formatNumber", a.details[c][b[d] + "_isd"], a.details[c][b[d]]);
                                a.details[c][b[d]] = e.replace(a.details[c][b[d] + "_isd"], "");
                            }
                },
                _remove_: function () {
                    this.pipe.off();
                },
            }
        );
    }),
    define({ name: "at.trips.utils", extend: "spamjs.modal", modules: ["spamjs.modal", "jQuery", "_", "moment", "at.tripservice", "at.common.functions", "at.trips.common"] }).as(function (a, b, c, d, e, f, g, h) {
        return {
            saveToTrips: function (a) {
                function e(a) {
                    a.length > 0 &&
                        ((j.params.trip_id = a[0]),
                        f.saveToTrips(j.event_name, j.params).done(function (a) {
                            k.resolve(!0, a), void 0 !== i && null != i && i.modal("hide");
                        }));
                }
                var i = null,
                    j = c.extend(!0, { view: null, event_name: null, params: null }, a),
                    k = c.Deferred(),
                    l = b.instance({ src: "trips/at.trips.popover.merge.html", data: { caption: "Select trip from the following list", buttonLabel: "Save to Trip", showNewTrip: !0, showMessage: !1 } });
                return (
                    f.getList().done(function (a) {
                        if (a.success)
                            if (void 0 !== a.data.active) {
                                var b = d.findWhere(a.data.active, { is_default: 1 });
                                if (void 0 === b)
                                    j.view.add("#myModal", l).done(function () {
                                        (i = $("#myModal")),
                                            i.on("hidden.bs.modal", function () {
                                                c(this).closest("view").remove();
                                            });
                                        var b = c(document.createDocumentFragment());
                                        for (var d in a.data.active) b.append(c("<li/>", { "data-tripid": a.data.active[d].id, class: "" }).html(a.data.active[d].name));
                                        i.find("ul").html(b),
                                            i.find(".no_data-js, .loader-js").hide().end().find("ul").show(),
                                            i.delegate(".css-movenew-trip-popup li", "click", function () {
                                                var a = c(this);
                                                void 0 !== a.attr("data-selected")
                                                    ? a.removeAttr("data-selected").removeClass("css-active")
                                                    : void 0 === a.attr("data-disabled") && (a.siblings("li").removeAttr("data-selected").removeClass("css-active"), a.attr("data-selected", "true").addClass("css-active"));
                                                var b = c(this).parent();
                                                b.find("li[data-selected]").length > 0
                                                    ? b.closest(".css-move-mid-cont").next().find("button").removeAttr("disabled")
                                                    : b.closest(".css-move-mid-cont").next().find("button").attr("disabled", "disabled"),
                                                    (b = null);
                                            }),
                                            i.find(".css-move-button span").on("click", function () {
                                                var a = c(this);
                                                if (a.find("button").length > 0) {
                                                    var b = i.find(".css-movenew-trip-popup li[data-selected]");
                                                    if (b.length > 0) {
                                                        i.find("button").attr({ disabled: "disabled" }).addClass("loading").removeClass("fill");
                                                        var d = [];
                                                        b.each(function () {
                                                            d.push(c.trim(b.attr("data-tripid")));
                                                        }),
                                                            (b = null),
                                                            e(d);
                                                    }
                                                } else i.modal("hide"), k.resolve(!1);
                                                a.off("click");
                                            }),
                                            i.find(".add-new-trip-popup-js").on("click", function () {
                                                var a = c(this).closest(".css-movenew-trip-popup").find(".add-new-trip-input-js");
                                                a.show()
                                                    .find("input")
                                                    .on("keypress", function (a) {
                                                        13 === a.keyCode && $(this).siblings(".css-add-new-trip-input-actions").find(".add").trigger("click");
                                                    })
                                                    .focus()
                                                    .end()
                                                    .find(".add")
                                                    .on("click", function (b) {
                                                        b.stopPropagation();
                                                        var d = c(this);
                                                        if (void 0 !== d.attr("data-disabled")) return !1;
                                                        var e = d.parent().prev(),
                                                            i = c.trim(e.val());
                                                        if (i.length > 0) {
                                                            if (i.length > 20) return void g.alert.show("Please enter a trip name upto " + h.TRIP_NAME_LIMIT + " characters.", "error");
                                                            d.attr("data-disabled", "true"),
                                                                e.attr({ readonly: "readonly" }),
                                                                d.hide().next().hide().next().show(),
                                                                f
                                                                    .addTrip({ name: i })
                                                                    .done(function (b) {
                                                                        b.success
                                                                            ? (void 0 !== b.data[0].id &&
                                                                                  (e.val("").parent().removeClass("error"),
                                                                                  a
                                                                                      .hide()
                                                                                      .closest(".css-move-mid-cont")
                                                                                      .find("ul")
                                                                                      .prepend('<li data-tripid="' + b.data[0].id + '">' + i + "</li>")
                                                                                      .find("li:nth-child(1)")
                                                                                      .trigger("click")),
                                                                              g.alert.show("Trip has been added successfully.", "success"))
                                                                            : is.Empty(b.errors) ||
                                                                              (e.parent().addClass("error"), c.inArray(121, b.errors) > -1 && g.alert.show("A trip with same name already exists. Please add new trip name.")),
                                                                            d.show().next().show().next().hide(),
                                                                            d.removeAttr("data-disabled"),
                                                                            e.removeAttr("readonly");
                                                                    })
                                                                    .fail(function () {
                                                                        d.show().next().show().next().hide(), d.removeAttr("data-disabled"), e.removeAttr("readonly").val("").parent().removeClass("error");
                                                                    });
                                                        } else e.parent().addClass("error");
                                                    })
                                                    .next(".cancel")
                                                    .on("click", function (b) {
                                                        b.stopPropagation(), c(this).off("click"), c(this).prev().prev().val("").parent().removeClass("error"), a.hide();
                                                    });
                                            }),
                                            0 == a.data.active.length && i.find(".add-new-trip-popup-js").trigger("click");
                                    });
                                else {
                                    var m = [b.id];
                                    e(m);
                                }
                            } else k.resolve(!1), i.find("ul, .loader-js").hide().end().find(".no_data-js").show();
                        else k.resolve(!1);
                    }),
                    k.promise()
                );
            },
            moveToTrip: function () {
                return h.showTripList.apply(arguments[0], arguments);
            },
        };
    }),
    _define_({ name: "at.socialservice", modules: ["jQuery", "jsutils.file"] }).as(function (a, b) {
        var c = bootloader.config().apiUrl;
        return {
            _init_: function () {},
            shareSocialComment: function (a) {
                return b.ajax({ type: "POST", url: c + "/social/share", dataType: "json", data: b.param(a) });
            },
        };
    }),
    define({ name: "at.social.share", extend: "spamjs.view", modules: ["jQuery", "at.common.functions", "spamjs.modal", "at.socialservice", "at.login"] }).as(function (a, b, c, d, e, f) {
        return {
            events: { "click .js-post-comment": "shareSocialComment", "click .js-social-switch": "checkSocialLogin", "keypress .js-comment": "checkCharactersLeft" },
            _init_: function () {
                var a = this;
                (a.login = f.instance()), a.load({ src: "at.social.share.html", data: a.options.data });
            },
            checkCharactersLeft: function (a, c) {
                var d = b(c).val().length;
                this.$$.find(".js-characters-left").text(140 - d + "/140 characters left");
            },
            shareSocialComment: function (a, d) {
                var f = { message: this.$$.find(".js-comment").val(), link: this.$$.find(".js-url").val(), name: "Flights - Aertrip", caption: this.$$.find(".js-url").val(), service: [] },
                    g = this,
                    h = this.$$.find(".js-social-switch").filter(":checked");
                if (0 === h.length) return void c.alert.show("Please select one of the options");
                h.each(function () {
                    f.service.push(b(this).data("type"));
                }),
                    b(d).prop("disabled", !0).addClass("loading"),
                    e.shareSocialComment(f).done(function () {
                        b(d).prop("disabled", !1).removeClass("loading"), g.options.parent.remove(g.options.id);
                    });
            },
            checkSocialLogin: function (a, c, d) {
                return (
                    b(c).is(":checked")
                        ? this.login.authenticate(d.type, "post", !0).done(function (a) {
                              a.success ? b(c).prop("checked", !0) : b(c).prop("checked", !1);
                          })
                        : setTimeout(function () {
                              b(c).prop("checked", !1);
                          }),
                    preventPropagation(a)
                );
            },
            _remove_: function () {},
        };
    }),
    define({ name: "at.offers.section", extend: "spamjs.view.extended", modules: ["jQuery", "at.common.functions", "at.commonservice", "at.login"] }).as(function (a, b, c, d, e) {
        return {
            events: { "click .js-offer-details": "showOfferDetails" },
            _init_: function () {
                var a = this,
                    f = [];
                e.isAgent() ||
                    (d.getOffers().done(function (b) {
                        b.success &&
                            ((f = a.options.type
                                ? b.data.other.filter(function (b) {
                                      return (
                                          b.tags.filter(function (b) {
                                              return (b || "").toLowerCase() == (a.options.type || "").toLowerCase();
                                          }).length > 0
                                      );
                                  })
                                : b.data.other),
                            a.loadWithScroll({ src: "at.offers.section.html", data: f }).done(function () {
                                a.initializeOfferCards();
                            }));
                    }),
                    a.$$.find(".js-copy-offer-code").each(function () {
                        c.bindZeroClipboard(b(this));
                    }));
            },
            showOfferDetails: function (a, c, d) {
                "show" == d.action
                    ? (b(c).attr("data-action", "hide"), b(c).text("Hide Detail").closest("li").addClass("css-show-offer-details"))
                    : (b(c).attr("data-action", "show"), b(c).text("View Detail").closest("li").removeClass("css-show-offer-details"));
            },
            initializeOfferCards: function () {
                c.initialize3DCardAnimation(this.$$.find(".js-offers-list"), { visibleCards: 3, offsetX: 50, diffX: 145, offsetZ: 0, diffZ: -70, duration: 500 });
            },
            _remove_: function () {},
        };
    }),
    _define_({ name: "at.flights.results", extend: "spamjs.view.extended", modules: ["moment", "at.flightservice", "jQuery", "jqbus", "jqrouter", "at.common.functions", "at.login", "spamjs.modal"] }).as(function (
        a,
        b,
        c,
        d,
        e,
        f,
        g,
        h,
        i
    ) {
        return {
            globalEvents: { "flights.filter.change": "onFlightsFilterChange", "filter.leg.index.change": "tabChangeFromFilter", document_click: "documentClick" },
            events: {
                "click .js-branded-fares": "openBrandedFaresPopup",
                "click .js-select-flight": "selectFlight",
                "click .js-leg-det-tab": "checkAllowedFlights",
                "click .js-pin-flight": "onPinClick",
                "click .js-unpin-flight": "onUnpinClick",
                "click .js-unpin-all-flights": "unpinAllFlights",
                "jq.popover.open .js-same-fare-option": "onSameIntlFareOptionClick",
                "jq.popover.open .js-multi-baggage-popover": "openMultiBaggagePopover",
                "click .js-same-fare-option, .js-more-option, .js-book-flight, .js-print-email-single-flight": "preventToggle",
                "click .js-save-to-trips": "saveToTrips",
                "click .js-booking-data,.js-down-arrow": "loadResultDetailBox",
                "click  ul.tabs li a": "onTabSelect",
                "click .js-humane-sort-info": "openHumaneSortInfo",
                "click .sort": "onSortClick",
                "mouseover .js-tab-sepatator-indicator, .js-grouped-flights .js-booking-data": "onGroupFlightsMouseOver",
                "mouseout .js-tab-sepatator-indicator, .js-grouped-flights .js-booking-data": "onGroupFlightsMouseOut",
                "click .js-flights-return-dep-tab, .js-multi-flight-dep-tab": "onMultiFlightSelect",
                "click .js-undo-filters": "undoFilters",
                "click jq-carousels .crous-handle": "slide_crous",
                "click .js-email-pinned-flights, .js-print-pinned-flights": "openPinnedEmailPopup",
                "click .js-whatsapp-pinned-flights, .js-copy-pinned-flights": "openPinnedEmailPopup",
                "click .js-bcc-text-in-cc, .js-email-top-bcc": "showBccInputField",
                "click .js-email-top-cc, .js-cc-text-in-bcc": "showCcInputField",
                "click .js-send-email": "sendPinnedFlightsInEmail",
                "click .js-print-pinned": "PrintDiv",
                "click .pagination > li:not(.js-rotate-search-index)": "onFilterTabSelect",
                "click  .js-rotate-search-index": "rotateSearchIndex",
                "click .js-pinned-main,#js-pinned-email-content": "pinnedFlightsClick",
                "click .js-cancel-email-popup": "closePinnedEmailPopup",
                "modal.closed": "fareConfirmationBoxClose",
                "focusout #js-pinned-email-content input.js-email": "emailValidator",
                "click .js-toggle-humane-results": "toggleHumaneResults",
                "click .js-prev-date:not(.css-disable-color), .js-next-date:not(.css-disable-color)": "changeTravelDateShortcut",
            },
            slide_crous: function (a, b) {
                var c = jQuery(b),
                    d = c.closest("jq-carousels"),
                    e = d.attr("index");
                (e = c.hasClass("right") ? 1 : 0), d.attr("index", e);
            },
            _init_: function () {
                var a = this;
                (a.pipe = e.instance()),
                    (a.login = h.instance()),
                    a.pipe.bind(this),
                    (this.jqrouter = f.instance()),
                    (a.selectedFlights = []),
                    (a.rescheduling = a.options.rescheduling),
                    (a.commonFunctions = g.instance()),
                    (a.validator = g.validator()),
                    d(window).on("scroll", function () {
                        d(document).height() <= d(this).scrollTop() + d(this).height() + 800 && a.appendResults();
                    });
            },
            onFilterTabSelect: function (a, b, c) {
                this.searchIndex == c.index ||
                    is.Empty(c.index) ||
                    (is.Empty(this.filterInstance.filters[c.index].modFilterData) && "S" != this.searchType && "I" != this.flightType) ||
                    ((this.searchIndex = c.index), this.filterInstance.setSearchIndex(c.index), this.filterInstance.render(), this.setTabSelectionInDocument());
            },
            rotateSearchIndex: function (a, b) {
                this.searchIndex === this.totalLegs - 1 ? (this.searchIndex = 0) : this.searchIndex++,
                    d(b)
                        .attr("data-index", this.searchIndex + 1)
                        .text(this.searchIndex + 1),
                    this.filterInstance.setSearchIndex(this.searchIndex),
                    this.filterInstance.render(),
                    this.setTabSelectionInDocument(),
                    "I" == this.flightType &&
                        "S" != this.searchType &&
                        (this.$$.find(".js-flights-main-sorting-bar .pagination li")
                            .text(this.searchIndex + 1)
                            .attr("data-index", this.searchIndex)
                            .addClass("selected"),
                        (this.results[0].searchIndex = this.searchIndex),
                        this.results[0].sortIntlFlightsAttributes(),
                        this.showResults(this.results[0].superResults));
            },
            setSearchVariables: function (a, b, c, d, e) {
                if ((this.setSearchType(b), this.setSearchInstance(a), this.setTotalLegs(c), this.setFlightType(d), !e)) {
                    (this.selectedFlights = []), (this.manuallySelected = []), (this.resultsShownIndex = []);
                    for (var f = 0; f < c; f++) (this.selectedFlights[f] = 0), (this.resultsShownIndex[f] = 0);
                }
            },
            setSearchType: function (a) {
                this.searchType = a;
            },
            setSearchInstance: function (a) {
                this.results = a;
            },
            setSearchIndex: function (a) {
                (this.searchIndex = a), this.setTabSelectionInDocument();
            },
            setTotalLegs: function (a) {
                this.totalLegs = a;
            },
            setFlightType: function (a) {
                this.flightType = a;
            },
            setSector: function (a, b, c) {
                (this.sectorName = a), (this.sectorDate = b), (this.sectorTitle = c);
            },
            tabChangeFromFilter: function (a, b, c) {
                (this.searchIndex = parseInt(c.index)),
                    this.setTabSelectionInDocument(),
                    "I" == this.flightType && "S" != this.searchType
                        ? (this.$$.find(".js-flights-main-sorting-bar .pagination li")
                              .text(this.searchIndex + 1)
                              .attr("data-index", this.searchIndex)
                              .addClass("selected"),
                          (this.results[0].searchIndex = this.searchIndex),
                          this.results[0].sortIntlFlightsAttributes(),
                          this.showResults(this.results[0].superResults))
                        : "D" == this.flightType && (this.searchIndex >= 3 ? this.slide_crous(null, this.$$.find("jq-carousels .crous-handle.right")) : this.slide_crous(null, this.$$.find("jq-carousels .crous-handle.left")));
            },
            setTabSelectionInDocument: function () {
                var a = parseInt(this.searchIndex) + 1;
                d(".pagination > li").removeClass("selected"), d(".pagination > li:contains(" + a + ")").addClass("selected");
            },
            showResults: function (a) {
                var b,
                    c,
                    d = this,
                    e = "",
                    f = 1 * d.results[0].getHiddenHumanResultsCount(),
                    g = d.jqrouter.getQueryParam("view"),
                    h = d.$$.find(".js_results_sorted");
                return (
                    "I" == this.flightType
                        ? ((b = is.Empty(d.results[0].intlModFilters[0]) ? [] : d.results[0].intlModFilters[0].fq.value),
                          (c = a.resKeys.PF),
                          (e = is.Empty(a.resKeys.RF) && is.Empty(a.resKeys.PF) && 0 === f ? "at.flights.undo.filter.html" : "international/at.flights.international.sorted.html"))
                        : ((b = is.Empty(d.results[0].modFilterData) ? [] : d.results[0].modFilterData.fq.value),
                          (c = a.PF),
                          (e = is.Empty(a.RF) && is.Empty(a.PF) && 0 === f ? "at.flights.undo.filter.html" : "at.flights.results.sorted.html")),
                    is.Empty(g) || "list" == g
                        ? this.load({ selector: ".js_results_sorted", src: e, data: { data: a, rescheduling: d.rescheduling, totalLegs: d.totalLegs, isSearchComplete: d.results[0].isSearchComplete() } }).done(function () {
                              is.Empty(c) ? h.removeClass("css-pinned-flight") : h.addClass("css-pinned-flight"), d.doBindingsSingle(b, f);
                          })
                        : d.renderTimelineViewResultsOnly(a, f).done(function () {
                              d.doBindingsSingle(b, f);
                          })
                );
            },
            onFlightsFilterChange: function (a, b, c) {
                var d = this;
                if (((d.searchIndex = c.searchIndex), "S" == d.searchType)) d.renderSingleFlight(c);
                else if ("S" != this.searchType && "I" == this.flightType)
                    "I" == d.flightType &&
                        ("search" == c.from && 0 === d.$$.find(".rightSectionHd").length
                            ? ((d.filterInstance = c.filterInstance),
                              d.load({ src: "at.flights.results.html", data: { searchType: "I" } }).done(function () {
                                  d.showResults(d.results[0].superResults);
                              }))
                            : d.showResults(d.results[0].superResults));
                else if ("R" == this.searchType && "D" == this.flightType)
                    "search" == c.from
                        ? ((d.filterInstance = c.filterInstance),
                          0 === d.$$.find(".js-return-flights-title").length ? d.renderReturnResultsHeader(d.searchIndex, !0) : (d.setPrevNextDateNavigation(), d.renderDomesticReturnResults(d.searchIndex, !0)))
                        : d.showMultiResults();
                else if ("M" == this.searchType && "D" == this.flightType)
                    if ("search" == c.from) {
                        d.filterInstance = c.filterInstance;
                        var e = { selectedFlights: d.selectedFlights, searchIndex: d.searchIndex, totalLegs: d.totalLegs };
                        0 === d.$$.find(".allFlightsTiming").length ? d.renderMultiResultsHeader(d.searchIndex, e) : (d.setPrevNextDateNavigation(), d.showMultiResults(!1, !0), d.setTabSelectionInDocument());
                    } else d.showMultiResults();
                d.filterInstance && d.filterInstance.changeFilterCount();
            },
            renderSingleFlight: function (a) {
                var b = this,
                    c = b.results[b.searchIndex].getFilteredResults();
                is.Empty(c) ||
                    ("search" == a.from && (b.filterInstance = a.filterInstance),
                    "search" == a.from || "renderAll" == a.action
                        ? "filter" == a.from && a.viewChange
                            ? (b.$$.html(g.getLoaderHTML("large")),
                              setTimeout(function () {
                                  b.loadResultsHTML(a, c);
                              }, 0))
                            : b.loadResultsHTML(a, c)
                        : b.showResults(c));
            },
            loadResultsHTML: function (a, c) {
                var d = this,
                    e = d.jqrouter.getQueryParam("view");
                d.load({ src: "at.flights.results.html", data: { rescheduling: d.rescheduling, depart: b(d.jqrouter.getQueryParam("depart"), "DD-MM-YYYY"), view: e } }).done(function () {
                    is.Empty(e) || "list" == e ? d.showResults(c) : d.renderTimelineView(c, a);
                });
            },
            renderTimelineView: function (a) {
                var b = this,
                    c = b.results[0].extractTimelineData();
                c.min, c.max;
                return (
                    (a.range = c),
                    (a.sectorTitle = b.sectorTitle),
                    (a.rescheduling = b.rescheduling),
                    b.load({ selector: ".js_results_sorted", src: "at.flights.timeline.view.html", data: a }).done(function () {
                        b.showResults(a), b.initializeTimelineSlider(a);
                    })
                );
            },
            initializeTimelineSlider: function (a) {
                var b,
                    c,
                    e = this,
                    f = a.range,
                    g = f.min,
                    h = f.max,
                    i = e.$$.find(".css-takeoff-bar-box"),
                    j = e.$$.find(".css-landing-bar-box"),
                    k = d("<span class='css-time-slider-tooltip'/>").hide(),
                    l = e.results[0].modFilterData;
                (b = l.ar_dt.value[1] == f.destination.max ? f.max : 1 * l.ar_dt.value[1] + (f.max - f.destination.maxExact - f.destination.extraMax)), (c = l.dep_dt.value[0] == f.origin.min ? 0 : 1 * l.dep_dt.value[0]);
                var m = e.$$.find(".css-fl-time-slider")
                    .slider({
                        range: !0,
                        values: [g, h],
                        min: g,
                        max: h,
                        step: 1,
                        create: function () {
                            d(this).slider("values", [c, b]);
                        },
                        change: function (a, b) {
                            return d(b.handle).tooltip("hide"), 1 == d(b.handle).index() ? e.setTakeOffBoundary(b, f, i, this) : e.setLandingBoundary(b, f, j, this);
                        },
                        start: function (a, b) {
                            d(b.handle).find("span").show(), d(b.handle).tooltip("hide");
                        },
                        slide: function (a, b) {
                            return d(b.handle).tooltip("hide"), 1 == d(b.handle).index() ? e.setTakeOffBoundary(b, f, i, this) : e.setLandingBoundary(b, f, j, this);
                        },
                        stop: function (a, b) {
                            d(b.handle).find("span").hide(),
                                e.filterInstance.changeFilterCountAndAnimateReset(),
                                e.filterInstance.setFiltersToQuery("ar_dt", 0),
                                e.filterInstance.setFiltersToQuery("dep_dt", 0),
                                e.showResults(e.results[e.searchIndex].getFilteredResults()),
                                d(b.handle).tooltip("show");
                        },
                    })
                    .find(".ui-slider-handle")
                    .append(k);
                m.first().tooltip({ title: "Take-off Time", placement: "top" }), m.last().tooltip({ title: "Landing Time", placement: "top" });
            },
            setTakeOffBoundary: function (a, c, e, f) {
                var g,
                    h,
                    i = a.value,
                    j = a.values[1] - a.values[0],
                    k = 0.125 * (c.max - c.min),
                    l = c.origin.max,
                    m = !1;
                if (
                    (a.value < l && j < k ? ((i = a.values[1] - k), (m = !0)) : a.value > l && j < k ? ((i = a.values[1] - k < l ? a.values[1] - k : l), (m = !0)) : a.value > l && j > k ? ((i = l), (m = !0)) : ((i = a.value), (m = !1)),
                    (g = b(c.base).add(i, "minute").format("HH:mm, ddd")),
                    (h = (100 * i) / (c.max - c.min) + "%"),
                    d(a.handle).find("span").text(g),
                    e.width(h).next().width(h),
                    this.results[0].updateFilter("dep_dt", [i < c.origin.min ? c.origin.min : i, null]),
                    m)
                )
                    return d(f).slider("values", [i, a.values[1]]), !1;
            },
            setLandingBoundary: function (a, c, e, f) {
                var g,
                    h,
                    i = a.value,
                    j = a.values[1] - a.values[0],
                    k = 0.125 * (c.max - c.min),
                    l = c.max - c.destination.maxExact - c.destination.extraMax,
                    m = c.destination.min + ("multi" == c.timezone ? l : 0),
                    n = !1;
                if (
                    (a.value < m && j < k
                        ? ((i = a.values[0] + k > m ? a.values[0] + k : m), (n = !0))
                        : a.value > m && j < k
                        ? ((i = a.values[0] + k), d(f).slider("values", [i, a.values[1]]), (n = !0))
                        : a.value < m && j > k
                        ? ((i = m), d(f).slider("values", [i, a.values[1]]), (n = !0))
                        : (i = a.value),
                    (g = b(c.base)
                        .add(i + c.offset, "minute")
                        .format("HH:mm, ddd")),
                    (h = (100 * (c.max - i)) / (c.max - c.min) + "%"),
                    d(a.handle).find("span").text(g),
                    e.width(h).next().width(h),
                    c.max - i > c.destination.extraMax && this.results[0].updateFilter("ar_dt", [null, i - ("multi" == c.timezone ? l : 0)]),
                    n)
                )
                    return d(f).slider("values", [a.values[0], i]), !1;
            },
            renderTimelineViewResultsOnly: function (a, b) {
                var c,
                    d = this,
                    e = d.results[0].extractTimelineData();
                return (
                    (a.range = e),
                    (a.rescheduling = d.rescheduling),
                    (a.sectorTitle = d.sectorTitle),
                    (c = is.Empty(a.RF) && is.Empty(a.PF) && 0 === b ? "at.flights.undo.filter.html" : "at.flights.timeline.view.results.html"),
                    d.load({ selector: ".js-results-cont", src: c, data: { details: a, isSearchComplete: d.results[0].isSearchComplete() } })
                );
            },
            renderReturnResultsHeader: function (a) {
                var b = this;
                b.load({ src: "return/at.flights.return.results.header.html", data: { sectorTitle: b.sectorTitle, rescheduling: b.rescheduling } }).done(function () {
                    b.setPrevNextDateNavigation(), b.renderDomesticReturnResults(a);
                });
            },
            renderDomesticReturnResults: function (a, b) {
                var c = this;
                (0 !== a && 1 !== a) || c.showMultiResults(!1, b);
                var d = c.results[0].getAirlineWiseMinFare(),
                    e = c.results[1].getAirlineWiseMinFare(),
                    f = c.getReturnTabsMinFare(c.results[2].specialComboResults, d, e);
                is.Empty(f) || c.$$.find(".airlinesTab").find("jq-tab").val();
                c.setTabSelectionInDocument();
            },
            setPrevNextDateNavigation: function () {
                var a = this,
                    c = [],
                    d = [];
                "R" == this.searchType ? ((c[0] = a.jqrouter.getQueryParam("depart")), (c[1] = a.jqrouter.getQueryParam("return"))) : (c = a.jqrouter.getQueryParam("depart"));
                for (var e = 0; e < c.length; e++) {
                    c[e] = b(c[e], "DD-MM-YYYY");
                    var f,
                        g = c[e].format("DD MMM YYYY");
                    if ((is.Empty(a.sectorTitle[e].origin) || is.Empty(a.sectorTitle[e].dest)) && 0 === e) f = "Departure Flight";
                    else if ((is.Empty(a.sectorTitle[e].origin) || is.Empty(a.sectorTitle[e].dest)) && 1 === e) f = "Return Flight";
                    else if (a.totalLegs > 2) {
                        var h = a.sectorTitle[e].origin,
                            i = a.sectorTitle[e].dest;
                        f =
                            '<span class="flights--tooltip" title="' +
                            (h.length > 8 ? h : "") +
                            '">' +
                            (h.length > 8 ? h.substr(0, 6) + "..." : h) +
                            '</span> → <span class="flights--tooltip" title="' +
                            (i.length > 8 ? i : "") +
                            '">' +
                            (i.length > 8 ? i.substr(0, 6) + "..." : i) +
                            "</span>";
                    } else f = a.sectorTitle[e].origin + " → " + a.sectorTitle[e].dest;
                    (d[e] = a.$$.find("#js-flights-leg-sort-" + e).siblings(".flightsHeadings")), d[e].find(".depDate").text(g).siblings().find(".js-prev-date, .js-next-date").removeClass("css-disable-color"), d[e].find(".depHd").html(f);
                }
                for (var j = 0; j < c.length - 1; j++)
                    0 === c[j].diff(b().format("YYYY-MM-DD"), "days") && d[j].find(".js-prev-date").addClass("css-disable-color"),
                        0 === c[j].diff(c[j + 1], "days") && (d[j].find(".js-next-date").addClass("css-disable-color"), d[j + 1].find(".js-prev-date").addClass("css-disable-color"));
            },
            renderReturnAirlineTabs: function (a) {
                return this.load({ src: "return/at.flights.return.results.special.fare.tab.html", selector: ".js-special-return-tabs", data: a });
            },
            getAirlineWiseCombinedMinFares: function (a, b) {
                var c = _.keys(a),
                    d = _.keys(b),
                    e = _.union(c, d),
                    f = {};
                if (!_.isEmpty(a) && !_.isEmpty(b)) for (var g = 0; g < e.length; g++) f[e[g]] = 1 * a[e[g]].fare + 1 * b[e[g]].fare;
                return f;
            },
            renderMultiResultsHeader: function (a, b) {
                var c = this;
                c.load({ src: "multi/at.flights.multi.results.header.html", data: b }).done(function () {
                    c.setPrevNextDateNavigation(), c.showMultiResults(!1, !0), c.setTabSelectionInDocument();
                });
            },
            renderUndoTemplate: function (a) {
                var b = this;
                return b.load({ selector: "#js-flights-leg-" + a, src: "at.flights.undo.filter.html", data: { isSearchComplete: b.results[a].isSearchComplete() } }).done(function () {
                    b.$$.find(".js-toggle-humane-results[data-index=" + a + "]").hide(), b.changeMultiResultHeader(a);
                });
            },
            showMultiResults: function (a, b) {
                for (var c = 0; c < this.totalLegs; c++) this.renderAllResults(c, a, b);
            },
            renderAllResults: function (a, b, c, d) {
                var e,
                    f = this,
                    g = 1 * f.results[a].getHiddenHumanResultsCount();
                if ((b || (f.resultsShownIndex[a] = 0), f.setDefaultSelectedFlights(a, c), (e = f.getMultiResults(a, b)), (!is.Empty(e) && !is.Empty(e.RF)) || (!isNaN(g) && 0 !== g)))
                    return f.load({ selector: "#js-flights-leg-" + a, src: "multi/at.flights.multi.results.leg.html", data: e }).done(function () {
                        f.doBindingsDomesticMulti(a, g), f.changeMultiResultHeader(a, d), b || (f.resultsShownIndex[a] = 1);
                    });
                f.renderUndoTemplate(a);
            },
            setResultsShownIndex: function () {
                var a = this,
                    b = Math.max.apply(null, a.resultsShownIndex);
                for (var c in a.resultsShownIndex) a.resultsShownIndex[c] = b;
            },
            appendResults: function () {
                for (var a = 0; a < this.totalLegs; a++) is.Empty(this.results[a]) || this.getMultiResultLegTemplate(a);
            },
            getMultiResultLegTemplate: function (a) {
                var b = this,
                    c = b.getMultiResults(a);
                is.Empty(c) ||
                    b.clone("multi/at.flights.multi.results.leg.html", c).done(function (c) {
                        b.$$.find("#js-flights-leg-" + a).append(c), b.applyTooltip(), b.resultsShownIndex[a]++;
                    });
            },
            getMultiResults: function (a, b) {
                var c = this,
                    d = c.results[a].getFilteredResults();
                if (is.Empty(d)) return [];
                var e = JSON.parse(JSON.stringify(d));
                return (
                    (e.RF = b ? (is.Empty(e) && is.Empty(e.RF) ? [] : e.RF.slice(0, 20 * c.resultsShownIndex[a] + 20)) : is.Empty(e) && is.Empty(e.RF) ? [] : e.RF.slice(20 * c.resultsShownIndex[a], 20 * c.resultsShownIndex[a] + 20)),
                    (e.selectedLegFlight = c.selectedFlights[a]),
                    (e.totalLegs = c.totalLegs),
                    e
                );
            },
            setDefaultSelectedFlights: function (a, b) {
                var c = this,
                    d = c.results[a].getFilteredResults();
                if (is.Empty(d) || is.Empty(d.RF)) c.selectedFlights[a] = 0;
                else {
                    var e =
                        0 ===
                        d.RF.filter(function (b) {
                            return b.fk == c.selectedFlights[a].fk;
                        }).length;
                    b && !this.manuallySelected[a] ? (c.selectedFlights[a] = d.RF.slice(0, 1)[0]) : (is.Empty(c.selectedFlights[a]) || e) && (c.selectedFlights[a] = d.RF.slice(0, 1)[0]);
                }
            },
            undoFilters: function (a, b) {
                if ("I" == this.flightType) this.filterInstance.clearFilterFromResults(), this.showResults(this.results[0].superResults);
                else if ("S" == this.searchType) this.filterInstance.clearFilterFromResults(), this.renderSingleFlight({ action: "renderAll" });
                else {
                    var c = d(b).closest('[id^="js-flights-leg"]').attr("id").split("-"),
                        e = c.pop();
                    this.filterInstance.clearFilterFromResults(e), this.showMultiResults();
                }
            },
            getReturnTabsMinFare: function (a, b, c) {
                var d,
                    e = this,
                    f = _.keys(b),
                    g = _.keys(c),
                    h = _.union(f, g),
                    i = {},
                    j = -1;
                if (!is.Empty(b) && !is.Empty(c)) {
                    for (var k = 0; k < h.length; k++)
                        void 0 !== b[h[k]] &&
                            void 0 !== c[h[k]] &&
                            (void 0 !== a && (j = e.getSpecialComboFareForReturnTabs(a, b[h[k]].fk, c[h[k]].fk)),
                            (d = parseInt(b[h[k]].fare) + parseInt(c[h[k]].fare)),
                            (i[h[k]] = -1 != j && j < d ? { fare: j, save: d - j, fk: [b[h[k]].fk, c[h[k]].fk] } : { fare: d, save: 0, fk: [b[h[k]].fk, c[h[k]].fk] }));
                    return i;
                }
                return is.Empty(b) ? (is.Empty(c) ? void 0 : c) : b;
            },
            getSpecialComboFare: function (a, b) {
                var c = _.pluck(b, "fk");
                return _.filter(a, function (a) {
                    return _.isEqual(a.fk, c);
                })[0];
            },
            getSpecialComboFareForReturnTabs: function (a, b, c) {
                var d = _.filter(a, function (a) {
                    return a.fk[0] == b && a.fk[1] == c;
                });
                return void 0 === d[0] ? -1 : d[0].farepr;
            },
            onMultiFlightSelect: function (a, b, c) {
                var e = d(b).closest('[id^="js-flights-leg"]').attr("id").split("-"),
                    f = e[e.length - 1];
                this.$$.find("#js-flights-leg-" + f)
                    .find(".greenBg")
                    .removeClass("greenBg"),
                    (this.selectedFlights[f] = this.results[f].getResultsHavingFkey(c.fk)),
                    this.setManuallySelectedStatus(f),
                    this.changeMultiResultHeader(f),
                    d(b).addClass("greenBg");
            },
            setManuallySelectedStatus: function (a) {
                if ("all" == a) for (var b in this.selectedFlights) this.manuallySelected[b] = !0;
                else this.manuallySelected[a] = !0;
            },
            checkOverlapingFlights: function () {
                var a = d(".js-flights-timing"),
                    c = !1;
                a.closest('[id^="js-flights-leg-header-"]').find(".js-overlap-warning").hide(), a.removeClass("css-overlaping-flights-border");
                for (var e = 1; e < this.selectedFlights.length; e++) {
                    var f = b(this.selectedFlights[e - 1].ad + " " + this.selectedFlights[e - 1].at),
                        g = b(this.selectedFlights[e].dd + " " + this.selectedFlights[e].dt);
                    g.isBefore(f)
                        ? (a.eq(e - 1).addClass("css-overlaping-flights-border"), a.eq(e).addClass("css-overlaping-flights-border"), c || (c = !0))
                        : g.diff(f, "minute") <= 120 &&
                          (a
                              .eq(e - 1)
                              .closest('[id^="js-flights-leg-header-"]')
                              .find(".js-overlap-warning")
                              .show(),
                          a.eq(e).closest('[id^="js-flights-leg-header-"]').find(".js-overlap-warning").show());
                }
                c && d(".js-book-flight, .js-book-flight+i").addClass("disabled").attr("disabled", !0);
            },
            changeMultiResultHeader: function (a, b) {
                var c,
                    e = this,
                    f = "",
                    h = 0,
                    i = 0,
                    j = [];
                f =
                    0 !== this.selectedFlights[a]
                        ? "R" == this.searchType
                            ? e.getReturnResultHeaderHtmlStr(a)
                            : e.getMultiResultHeaderHtmlStr(a)
                        : '<div class="css-only-place-name">' + e.sectorTitle[a].oiata + " → " + e.sectorTitle[a].diata + "</div>";
                for (var k = 0; k < e.totalLegs; k++) {
                    if (0 === this.selectedFlights[k]) {
                        h = 1;
                        break;
                    }
                    i += 1 * this.selectedFlights[k].farepr;
                }
                if (0 === h) {
                    if ((d(".js-book-flight, .js-book-flight+i").prop("disabled", !1).removeClass("disabled"), !is.Empty(e.results[this.totalLegs].specialComboResults))) {
                        var l = e.getSpecialComboFare(e.results[this.totalLegs].specialComboResults, this.selectedFlights);
                        void 0 !== l && l.farepr < i
                            ? (d("#js-regular-fare").html(g.format.amount(i)),
                              d("#js-regular-fare").data("special", !0),
                              (e.isCombo = !0),
                              (i = l.farepr),
                              (this.selectedComboFare = l),
                              is.Empty(e.options.flightsInstance) || b || e.options.flightsInstance.openMoreInfo())
                            : (d("#js-regular-fare").html(""), d("#js-regular-fare").data("special", !1), (e.isCombo = !1), (this.selectedComboFare = 0));
                    }
                    (c = "R" == this.searchType ? e.$$.find(".priceTotal") : d("#js-multi-flights-price-box")),
                        c.find(".currency-js").length > 0 ? e.animateFare(c.find("span:eq(1)"), c.find("span:eq(1)").data("base"), i) : c.html(g.format.amount(i)),
                        _.pluck(e.selectedFlights, "otherfares").filter(function (a) {
                            return a;
                        }).length > 0
                            ? d(".js-book-flight").addClass("css-button-dropdown").next().show()
                            : d(".js-book-flight").removeClass("css-button-dropdown").next().hide();
                } else
                    "R" == this.searchType ? e.$$.find(".priceTotal").html("NO MATCH") : d("#js-multi-flights-price-box").html("NO MATCH"),
                        d(".js-book-flight, .js-book-flight+i").prop("disabled", !0).addClass("disabled"),
                        e.$$.find("#js-regular-fare").html(""),
                        e.$$.find("#js-regular-fare").data("special", !1),
                        (e.isCombo = !1);
                if ("R" == this.searchType) {
                    e.$$.find("#js-flights-leg-header-" + a)
                        .effect("highlight", {}, 1e3)
                        .find(".css-flight-logo-dest")
                        .html(f)
                        .children();
                } else
                    d("#js-flights-leg-header-" + a)
                        .html(f)
                        .effect("highlight", {}, 1e3);
                for (var m = 0; m < e.selectedFlights.length; m++) j[m] = e.selectedFlights[m].fk;
                e.$$.find(".js-baggage-policy").data("fk", j.join(",")), e.checkOverlapingFlights(), d(".flights--tooltip").tooltip({ placement: "bottom" });
            },
            getReturnResultHeaderHtmlStr: function (a) {
                var b,
                    c,
                    d,
                    e = this.selectedFlights[a],
                    f = e.ap,
                    g = this.results[a].airlineDetails,
                    h = this.results[a].airportDetails,
                    i = "";
                return (
                    (b = is.Empty(e.al) ? "" : IMAGE_PATH + "/" + (e.al.length > 1 ? "multi-carrier-flight" : e.al[0]) + ".png"),
                    (c = 0 == e.stp ? "Non-stop" : e.stp + (e.stp > 1 ? " stops" : " stop")),
                    (d = this.getDateDifferenceInDays(e.dd, e.ad)),
                    (i =
                        '<div class="companyLogo"><img src="' +
                        b +
                        '" width="27px" height="27px;"></div><div class="destinationText"><span class="stnsDetails js-flights-timing"><i class="flights--tooltip" title="' +
                        h[f[0]].n +
                        ", " +
                        h[f[0]].c +
                        ", " +
                        h[f[0]].cn +
                        '">' +
                        f[0] +
                        "</i> <span>" +
                        e.dt +
                        " - " +
                        e.at),
                    d > 0 && (i += '<sup title="' + this.getArrivalLabel(e.dd, e.ad, !0) + '" class="flights--tooltip" >' + (d > 0 ? "+" : "") + d + "</sup>"),
                    (i += '</span> <i class="flights--tooltip" title="' + h[f.slice(-1)].n + ", " + h[f.slice(-1)].c + ", " + h[f.slice(-1)].cn + '">' + f[f.length - 1] + "</i>"),
                    (i +=
                        '<jq-popover class="css-error-circle-box" style="display: inline-block;"><jq-popover-title data-placement="bottom" data-trigger="hover"><span class="css-circle">!</span></jq-popover-title><jq-popover-content><div class="css-fl-error-overlap"><span>Next flight\'s take-off time should be after previous flight\'s arrival time</span></div></jq-popover-content></jq-popover><jq-popover style="display: none;" class="js-overlap-warning css-warning-box"><jq-popover-title data-placement="bottom" data-trigger="hover"><span class="css-circle">!</span></jq-popover-title><jq-popover-content><div class="css-fl-error-overlap"><span>You have less than 2 hours between your flights</span></div></jq-popover-content></jq-popover></span><span class="stopsDuration">' +
                        (e.al.length > 1 ? "Multi Carriers (" + e.al.length + ")" : g[e.al[0]] ? g[e.al[0]] : e.al[0]) +
                        ", " +
                        c +
                        ', <i class="icon icon_clock-4pm"></i> ' +
                        this.formatDuration(e.tt) +
                        "</span>")
                );
            },
            getMultiResultHeaderHtmlStr: function (a) {
                var b,
                    c,
                    d = this.selectedFlights[a],
                    e = d.ap,
                    f = this.results[a].airlineDetails,
                    g = this.results[a].airportDetails,
                    h = "",
                    i = this.getDateDifferenceInDays(d.dd, d.ad);
                return (
                    (b = is.Empty(d.al) ? "" : IMAGE_PATH + "/" + (d.al.length > 1 ? "multi-carrier-flight" : d.al[0]) + ".png"),
                    (c = 0 == d.stp && 5 != this.totalLegs ? "Non-stop" : d.stp + (d.stp > 1 ? " stops" : " stop")),
                    5 != this.totalLegs
                        ? (h += '<div class="css-logo-stops-durations-cont"><div class="css-air-fl-logo-box"><img src="' + b + '" width="27px" height="27px;"></div><div class="css-stops-duration-box">')
                        : (h += '<div class="css-stops-durations-cont">'),
                    (h +=
                        '<div class="css-dest-place-name js-flights-timing"><div><span class="flights--tooltip" title="' + g[e[0]].n + ", " + g[e[0]].c + ", " + g[e[0]].cn + '">' + e[0] + ' </span><b><span class="">' + d.dt + " - " + d.at),
                    i > 0 && (h += '<sup title="' + this.getArrivalLabel(d.dd, d.ad, !0) + '" class="flights--tooltip" >' + (i > 0 ? "+" : "") + i + "</sup>"),
                    (h += '</span></b> <span class="flights--tooltip" title="' + g[e.slice(-1)].n + ", " + g[e.slice(-1)].c + ", " + g[e.slice(-1)].cn + '">' + e[e.length - 1] + "</span>"),
                    (h +=
                        '<jq-popover class="css-error-circle-box" style="display: inline-block;"><jq-popover-title data-placement="bottom" data-trigger="hover"><span class="css-circle">!</span></jq-popover-title><jq-popover-content><div class="css-fl-error-overlap"><span>Next flight\'s take-off time should be after previous flight\'s arrival time</span></div></jq-popover-content></jq-popover><jq-popover style="display: none;" class="js-overlap-warning css-warning-box"><jq-popover-title data-placement="bottom" data-trigger="hover"><span class="css-circle">!</span></jq-popover-title><jq-popover-content><div class="css-fl-error-overlap"><span>You have less than 2 hours between your flights</span></div></jq-popover-content></jq-popover></span></div><div class="css-stops-duration">' +
                        (d.al.length > 1 ? "Multi Carriers (" + d.al.length + ")" : f[d.al[0]] ? f[d.al[0]] : d.al[0]) +
                        ", " +
                        c +
                        ', <i class="icon icon_clock-4pm"></i> ' +
                        this.formatDuration(d.tt) +
                        "</div>"),
                    5 == this.totalLegs && (h += "</div>"),
                    (h += "</div>")
                );
            },
            loadResultDetailBox: function (a, b, c) {
                if (!(a.SAMEFAREOPTIONCLICK || a.MOREOPTIONCLICK || a.SAVETOTRIPSCLICK || a.PRINTCLICK || a.BRANDEDFARECLICK)) {
                    var d,
                        e,
                        f,
                        g,
                        h = this;
                    is.Empty(c.fk) || 0 !== h.$$.find("#js-result-detail-box-" + c.type + "-" + c.tabcount + " .js-hidden-result-detail").length
                        ? h.toggleResultDetailBox(a, b)
                        : "S" == this.searchType
                        ? ((d = h.results[h.searchIndex].getFilteredResults()),
                          (e = h.results[h.searchIndex].getFilteredResultsHavingFkey(c.fk)),
                          (f = "at.flights.result.detail.box.html"),
                          (g = { fk: c.fk, alData: d.AL, type: c.type, apData: d.AP, taxes: d.taxes, tabCount: c.tabcount, detail: e }),
                          h.loadResultDetailBoxTemplate(a, b, g, f).done(function () {
                              for (var a = e.leg[0].flights.length - 1; a >= 0; a--) {
                                  var b = { origin: e.leg[0].flights[a].fr, destination: e.leg[0].flights[a].to, airline: e.leg[0].flights[a].al, flight_number: e.leg[0].flights[a].fn };
                                  h.loadDelayIndexTemplate(b, e.leg[0].flights[a].ffk);
                              }
                          }))
                        : "I" == this.flightType &&
                          ((results = h.results[0].superResults),
                          (f = "international/at.flights.international.result.detail.html"),
                          (e = results.rdet[c.fk]),
                          (g = { fk: c.fk, rdet: results.rdet[c.fk], ldet: results.ldet, fdet: results.fdet, alData: results.AL, apData: results.AP, tabCount: c.tabcount, taxes: results.taxes, type: c.type }),
                          h.loadResultDetailBoxTemplate(a, b, g, f).done(function () {
                              for (var a = e.leg.length - 1; a >= 0; a--)
                                  for (var b = e.leg[a], c = results.ldet[b].flights.length - 1; c >= 0; c--) {
                                      var d = results.ldet[b].flights[c],
                                          f = { origin: results.fdet[d].fr, destination: results.fdet[d].to, airline: results.fdet[d].al, flight_number: results.fdet[d].fn };
                                      h.loadDelayIndexTemplate(f, d);
                                  }
                          }));
                }
            },
            loadDelayIndexTemplate: function (a, b) {
                var c = this;
                c.getDelayIndex(a).done(function (a) {
                    c.$$.find(".js-ffk-" + b).removeClass("loading"), c.load({ selector: ".js-ffk-" + b, src: "at.flights.delay.index.bar.html", data: a.data.delay_index || {} });
                });
            },
            loadResultDetailBoxTemplate: function (a, b, c, d) {
                var e = this;
                return this.view({ selector: "#js-result-detail-box-" + c.type + "-" + c.tabCount, src: d, data: c }).done(function () {
                    e.$$.find(".css-otherfees-cont").hide(), e.toggleResultDetailBox(a, b), e.applyTooltip();
                });
            },
            toggleResultDetailBox: function (a, b) {
                var c,
                    e = ".js-booking-card";
                c = d(b).hasClass("js-down-arrow") ? d(b).siblings(e).siblings(".js-toggle-box") : d(b).closest(e).siblings(".js-toggle-box");
                var f = c.find("div:first");
                c.find("jq-popover-title").popover("hide"),
                    "none" == f.css("display")
                        ? (f.show(),
                          f.css("margin-top", -1 * f.height()),
                          f.stop(!0, !0).animate(
                              { marginTop: "0px" },
                              {
                                  duration: 500,
                                  start: function () {
                                      c.css("overflow", "hidden"),
                                          c.siblings(".js-down-arrow").find("i").toggleClass("icon_double-down-arrow icon_double-up-arrow"),
                                          c.find(".js-down-arrow i").toggleClass("icon_double-down-arrow icon_double-up-arrow");
                                  },
                                  complete: function () {
                                      c.css("overflow", "");
                                  },
                              }
                          ))
                        : f.stop(!0, !0).animate(
                              { marginTop: "-" + f.height() + "px" },
                              {
                                  duration: 500,
                                  start: function () {
                                      c.css("overflow", "hidden"),
                                          c.siblings(".js-down-arrow").find("i").toggleClass("icon_double-down-arrow icon_double-up-arrow"),
                                          c.find(".js-down-arrow i").toggleClass("icon_double-down-arrow icon_double-up-arrow");
                                  },
                                  complete: function () {
                                      f.hide(), c.css("overflow", "");
                                  },
                              }
                          );
            },
            onPinClick: function (a, b, c) {
                var d,
                    e = this;
                if ("I" != e.flightType) {
                    (selectedFlight = c.fk.split(":~")), e.results[e.searchIndex].addPinnedResults(selectedFlight), (d = e.results[e.searchIndex].getFilteredResults());
                    var f = _.pluck(d.PF, "fk");
                    e.jqrouter.setQueryParam("PF", f);
                } else (selectedFlight = c.fk), e.results[0].addIntlPinnedResults(c.gid, selectedFlight), (d = e.results[0].superResults), e.jqrouter.setQueryParam("PF", d.resKeys.PF);
                e.showResults(d);
            },
            onUnpinClick: function (a, b, c) {
                var d,
                    e = this;
                if ("I" != e.flightType) {
                    (selectedFlight = c.fk.split(":~")), e.results[e.searchIndex].removePinnedFlight(selectedFlight), (d = e.results[e.searchIndex].getFilteredResults());
                    var f = _.pluck(d.PF, "fk");
                    e.jqrouter.setQueryParam("PF", f);
                } else (selectedFlight = c.fk), e.results[0].removeIntlPinnedFlight(c.gid, selectedFlight), (d = e.results[0].superResults), e.jqrouter.setQueryParam("PF", d.resKeys.PF);
                e.showResults(d);
            },
            unpinAllFlights: function () {
                var a = this;
                i.confirm(this, { title: "Do you wish to unpin all your pinned flights", buttonLabel: "Unpin All" }).done(function (b) {
                    if (b) {
                        var c = [];
                        a.$$.find("li.js-unpin-flight").each(function () {
                            if ("I" != a.flightType) {
                                (selectedFlight = d(this).data("fk").split(":~")), a.results[a.searchIndex].removePinnedFlight(selectedFlight), (c = a.results[a.searchIndex].getFilteredResults());
                                var b = _.pluck(c.PF, "fk");
                                a.jqrouter.setQueryParam("PF", b);
                            } else {
                                selectedFlight = d(this).data("fk");
                                var e = d(this).data("gid");
                                a.results[0].removeIntlPinnedFlight(e, selectedFlight), (c = a.results[0].superResults), a.jqrouter.setQueryParam("PF", c.resKeys.PF);
                            }
                        }),
                            d(".css-popup-overlay").remove(),
                            a.showResults(c);
                    }
                });
            },
            onTabSelect: function (a, b) {
                var c = d(b).attr("href");
                return d(b).closest("li").siblings().removeClass("selected"), d(b).closest("li").addClass("selected"), d(b).closest(".infoButton.tabs").siblings().hide(), d(c).show(), preventPropagation(a);
            },
            bookFlight: function (a, b, c) {
                var e,
                    f,
                    g = this,
                    h = {},
                    i = g.isCombo;
                is.Empty(g.options.flightsInstance) || g.options.flightsInstance.abortPreviousRequest(),
                    d(".js-book-flight, .js-book-flight+i").prop("disabled", !0),
                    "S" != g.searchType && "D" == g.flightType
                        ? ((e = _.pluck(g.selectedFlights, "fk")), d(".js-book-flight").addClass("loading"), i ? ((e = [e.join("~")]), (f = [g.selectedComboFare.farepr])) : (f = _.pluck(g.selectedFlights, "farepr")))
                        : 1 == g.rescheduling && g.totalLegs > 1
                        ? ((e = _.pluck(g.selectedFlights, "fk")), (f = _.pluck(g.selectedFlights, "farepr")), d(".js-book-flight").addClass("loading"))
                        : ((e = [c.fk]), (f = [c.fare]), d(b).addClass("loading")),
                    (h.sid = g.sid),
                    (h.old_farepr = f);
                for (var j = 0; j < e.length; j++) h["fk[" + j + "]"] = e[j];
                return ("I" == g.flightType || i) && (h.combo = !0), (g.bookingRequest = g.getBookingConfirmation(h, b)), preventPropagation(a);
            },
            getBookingConfirmation: function (a, b) {
                var e = this;
                return c
                    .getBookingConfirmation(a)
                    .done(function (a) {
                        d(".js-book-flight, .js-book-flight+i").prop("disabled", !1).removeClass("loading"),
                            a.success
                                ? 0 != a.data.itinerary.price_change
                                    ? e.add(
                                          i.instance({
                                              id: "js-fare-confirmation",
                                              module: "at.flights.booking.confirmation",
                                              moduleOptions: { data: { isCombo: "I" == e.flightType || e.isCombo, resp: a, target: b }, callback: e.confirmationAction.bind(e) },
                                              modalOptions: { backdrop: "static", keyboard: !1 },
                                          })
                                      )
                                    : e.continueToBook(a)
                                : (setTimeout(function () {
                                      i.confirm(e, { title: "Looks like that fare is no longer available.", buttonLabel: "Reload results", hideCancel: !0 }).done(function (a) {
                                          a && e.jqrouter.setQueryParam("reload", !e.jqrouter.getQueryParam("reload"));
                                      });
                                  }, 1e3),
                                  e.reloadAllTypeResults());
                    })
                    .fail(function () {
                        d(".js-book-flight, .js-book-flight+i").prop("disabled", !1).removeClass("loading");
                    });
            },
            reloadAllTypeResults: function () {
                var a = this;
                if ("I" == a.flightType) a.showResults(a.results[0].superResults);
                else if ("S" == a.searchType) {
                    var b = a.results[0].getFilteredResults();
                    a.showResults(b);
                } else a.showMultiResults();
            },
            fareConfirmationBoxClose: function (a) {
                if (!is.Empty(a.detail) && (is.Empty(a.detail) || d(a.detail.data.target).hasClass("js-book-flight"))) {
                    var b,
                        c,
                        e,
                        f = this,
                        g = a.detail.data.resp,
                        h = a.detail.data.target,
                        i = { j: [], aldet: "", apdet: "", taxes: "", cityap: "", f: [], c: [] };
                    if ("I" == f.flightType) {
                        var j = d(h).closest(".js-tab-sepatator");
                        (b = j.attr("id")),
                            (c = g.data.change_results[1].fk),
                            (i.j[c] = g.data.change_results[1]),
                            f.results[0].updateIntlChangeResultsFilters(i.j[c].farepr),
                            f.results[0].mergeInternationalResult({ results: i, vcode: i.j[c].vendor }, void 0, !0),
                            (e = j.find(".js-flight-price").find(".currency-js span:eq(1)").data("base")),
                            f.showResults(f.results[0].superResults).done(function () {
                                if (f.$$.find("#" + b).find(".js-fl-options-div-int").length > 0)
                                    f.$$.find("#" + b)
                                        .find(".js-fl-options-div-int")
                                        .effect("highlight", {}, 4e3);
                                else {
                                    var a = f.$$.find('.js-book-flight[data-fk="' + c + '"]')
                                        .closest(".css-fl-book-button")
                                        .siblings(".js-flight-price")
                                        .find(".currency-js span:eq(1)");
                                    f.animateFare(a, e, a.data("base")), a.effect("highlight", {}, 1e4);
                                }
                            });
                    } else if ("S" == f.searchType) {
                        var k = d(h).closest(".resultdetailboxInd, .js-grouped-flights");
                        (b = k.attr("id")), (c = g.data.change_results[1].fk), i.j.push(g.data.change_results[1]), f.results[0].updateChangeResultsFilters(i.j[0].farepr), f.results[0].mergeResult({ results: i, vcode: i.j[0].vendor });
                        var l = f.results[0].getFilteredResults();
                        (e = d(h).closest(".css-fl-book-button").siblings(".js-flight-price").find(".currency-js span:eq(1)").data("base")),
                            f.showResults(l).done(function () {
                                if (
                                    f.$$.find("#" + b)
                                        .parent()
                                        .prev()
                                        .find(".js-fl-options-div").length > 0
                                )
                                    f.$$.find("#" + b)
                                        .parent()
                                        .prev()
                                        .find(".js-fl-options-div")
                                        .effect("highlight", {}, 4e3);
                                else {
                                    var a = f.$$.find('.js-booking-data[data-fk="' + c + '"]').find(".js-flight-price .currency-js span:eq(1)");
                                    f.animateFare(a, e, a.data("base")), a.effect("highlight", {}, 1e4);
                                }
                            });
                    } else
                        for (var m in g.data.change_results)
                            (m *= 1),
                                0 !== m
                                    ? ((c = g.data.change_results[m].fk),
                                      (i.j[0] = g.data.change_results[m]),
                                      f.results[m - 1].updateChangeResultsFilters(i.j[0].farepr),
                                      f.results[m - 1].mergeResult({ results: i, vcode: i.j[0].vendor }),
                                      (e = f.$$.find(".js-multi-flight-dep-tab[data-fk='" + c + "'],.js-flights-return-dep-tab[data-fk='" + c + "']")
                                          .find(".js-flight-price .currency-js  span:eq(1)")
                                          .data("base")),
                                      f.renderAllResults(m - 1).done(function () {
                                          var a = f.$$.find(".js-multi-flight-dep-tab[data-fk='" + c + "'],.js-flights-return-dep-tab[data-fk='" + c + "']").find(".js-flight-price .currency-js  span:eq(1)");
                                          f.animateFare(a.find("div"), e, a.data("base")), a.effect("highlight", {}, 5e3);
                                      }))
                                    : ((i.c[0] = g.data.change_results[m]), f.results[2].setComboResults(i), f.showMultiResults());
                    f.filterInstance.render();
                }
            },
            selectFlight: function (a, b, c) {
                return (this.selectedFlights[this.searchIndex] = this.results[this.searchIndex].getResultsHavingFkey(c.fk)), this.changeMultiResultHeader(this.searchIndex), preventPropagation(a);
            },
            confirmationAction: function (a) {
                this.remove("js-fare-confirmation"), "continue" == a.type && this.continueToBook(a.itineraryData);
            },
            continueToBook: function (a) {
                var b = { id: a.data.itinerary.id, p: "flights" };
                1 === this.rescheduling && (b.action = "reschedule"), this.jqrouter.post("/checkout?" + d.param(b), a);
            },
            onMoreIconClick: function (a) {
                a.stopPropagation();
            },
            onSortClick: function (a, b) {
                var c = this;
                if ("S" == c.searchType) {
                    c.setSortStatus(b, 0), c.results[c.searchIndex].sortFlightsAttributes();
                    c.jqrouter.getQueryParam("view");
                    c.showResults(c.results[c.searchIndex].getFilteredResults());
                } else if ("I" == c.flightType) c.setSortStatus(b, 0), c.results[0].sortIntlFlightsAttributes(), c.showResults(c.results[0].superResults);
                else {
                    var e = d(b).closest('[id^="js-flights-leg-sort"]').attr("id").split("-"),
                        f = e.slice(-1);
                    c.setSortStatus(b, f), c.results[f].sortFlightsAttributes(), c.showMultiResults();
                }
            },
            setSortStatus: function (a, b) {
                var c = this;
                c.results[b].sortStatus[0] == d(a).closest("jq-tab-head").attr("value")
                    ? "asc" == c.results[b].sortStatus[1]
                        ? (c.results[b].sortStatus[1] = "desc")
                        : (c.results[b].sortStatus[1] = "asc")
                    : (c.results[b].sortStatus = [d(a).closest("jq-tab-head").attr("value"), "asc"]);
                var e = c.results.map(function (a) {
                    return a.sortStatus[0] + "_" + a.sortStatus[1];
                });
                c.jqrouter.setQueryParam("sort", e);
            },
            doBindingsSingle: function (a, c) {
                var e,
                    f = this,
                    g = (f.jqrouter.getQueryParam("view"), a.indexOf("aht") > -1 ? "Hide" : "Show"),
                    h = f.$$.find(".js-toggle-humane-results");
                f.$$.find(".resultdetailbox, .resultdetailboxInd, .js-grouped-flights").hide(),
                    f.$$.find("ul > :first-child a").each(function () {
                        d(this).closest("li").addClass("selected"), d(d(this).attr("href")).siblings("div:not(.tabs)").hide();
                    }),
                    f.$$.find(".css-otherfees-cont").hide(),
                    "asc" == f.results[0].sortStatus[1]
                        ? (f.$$.find(".icon.icon_sort-down-arrow, .icon.icon_sort-up-arrow").removeClass("icon icon_sort-down-arrow icon icon_sort-up-arrow"),
                          (e = f.$$.find("jq-tab-head[value=" + f.results[0].sortStatus[0] + "] i")
                              .removeClass("icon icon_sort-down-arrow")
                              .addClass("icon icon_sort-up-arrow")))
                        : (f.$$.find(".icon.icon_sort-down-arrow, .icon.icon_sort-up-arrow").removeClass("icon icon_sort-down-arrow icon icon_sort-up-arrow"),
                          (e = f.$$.find("jq-tab-head[value=" + f.results[0].sortStatus[0] + "] i")
                              .removeClass("icon icon_sort-up-arrow")
                              .addClass("icon icon_sort-down-arrow"))),
                    e.closest("jq-tab").attr("value", f.results[0].sortStatus[0]),
                    f.$$.find(".js-flight-info-widget")
                        .on("mouseenter", function () {
                            f.onCircleMouseOver(this);
                        })
                        .on("mouseleave", function () {
                            f.onCircleMouseOut(this);
                        }),
                    f.$$.find(".js-timeline-details-popover")
                        .on("mouseenter", function (a) {
                            f.onTimelineDurationDivMouseOver(a, a.originalEvent.target);
                        })
                        .on("mouseleave", function (a) {
                            f.onTimelineDurationDivMouseOut(a, a.originalEvent.target);
                        }),
                    f.$$.find(".js-tab-sepatator,.js-tab-sepatator-indicator").on("mouseenter", f.showMoreOptions).on("mouseleave", f.hideMoreOptions),
                    f.applyTooltip(),
                    0 === b(this.jqrouter.getQueryParam("depart"), "DD-MM-YYYY").diff(b().format("YYYY-MM-DD"), "days")
                        ? f.$$.find(".js-prev-date").addClass("css-disable-color")
                        : f.$$.find(".js-prev-date").removeClass("css-disable-color"),
                    0 === c || isNaN(c) ? h.hide() : f.toggleHumaneDisplayDiv(h, c, g);
            },
            applyTooltip: debounce(function () {
                var a = this;
                a.$$.find(".flights--tooltip").tooltip({ placement: "bottom" }),
                    a.$$.find(".css-ellipsis").each(function () {
                        g.addTooltipForEllipsis(this);
                    });
            }, 100),
            doBindingsDomesticMulti: function (a, b) {
                var c,
                    e = this,
                    f = e.$$.find("#js-flights-leg-sort-" + a),
                    g = is.Empty(e.results[a].modFilterData) ? [] : e.results[a].modFilterData.fq.value;
                if (
                    (f.find(".icon.icon_sort-down-arrow, .icon.icon_sort-up-arrow").removeClass("icon icon_sort-down-arrow icon icon_sort-up-arrow"),
                    "asc" == e.results[a].sortStatus[1]
                        ? f
                              .find("jq-tab-head[value=" + e.results[a].sortStatus[0] + "]")
                              .find("i")
                              .removeClass("icon icon_sort-down-arrow")
                              .addClass("icon icon_sort-up-arrow")
                        : f
                              .find("jq-tab-head[value=" + e.results[a].sortStatus[0] + "]")
                              .find("i")
                              .removeClass("icon icon_sort-up-arrow")
                              .addClass("icon icon_sort-down-arrow"),
                    f.find("jq-tab-head").removeAttr("active"),
                    f.find("jq-tab-head[value=" + e.results[a].sortStatus[0] + "]").attr("active", !0),
                    e.applyTooltip(),
                    e.selectedFlights.indexOf(0) > -1 ? d(".js-book-flight, .js-book-flight+i").addClass("disabled").attr("disabled", !0) : d(".js-book-flight, .js-book-flight+i").removeClass("disabled").attr("disabled", !1),
                    "M" == e.searchType && e.totalLegs > 2 && (e.initializeResizeFunction(), e.resizeMulticity()),
                    (c = g.indexOf("aht") > -1 ? "Hide" : "Show"),
                    0 === b || isNaN(b))
                )
                    e.$$.find(".js-toggle-humane-results[data-index=" + a + "]").hide();
                else {
                    var h = e.$$.find(".js-toggle-humane-results[data-index=" + a + "]");
                    e.toggleHumaneDisplayDiv(h, b, c);
                }
            },
            initializeResizeFunction: function () {
                var a = this;
                $(window).resize(function () {
                    a.resizeMulticity();
                });
            },
            resizeMulticity: function () {
                var a = this;
                if (a.totalLegs > 2) {
                    var b,
                        c = a.getResultsDivWidth();
                    if (a.totalLegs > 3) {
                        b = c / 3.1;
                        var e =
                            '<style id="js-flights-multi-results-style">jq-carousels[total="4"][index="1"] .allFlightsTiming {left: -' +
                            0.9 * b +
                            'px !important;}jq-carousels[total="5"][index="1"] .allFlightsTiming{left: -' +
                            2 * b * 0.95 +
                            "px !important;}</style>";
                        (e = d(e)), 0 === d("#js-flights-multi-results-style").length ? d("html > head").append(e) : d("#js-flights-multi-results-style").replaceWith(e);
                    } else b = c / 3;
                    d(".view-id-flightsResults .allFlightsTiming").css({ width: b * a.totalLegs + "px" }), d(".view-id-flightsResults .multiFlightsLeft").css({ width: b + "px" });
                }
            },
            formatAmount: function (a, b) {
                return (
                    b +
                    " " +
                    parseFloat(a)
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                );
            },
            formatDuration: function (a) {
                var b = parseInt(a / 60),
                    c = parseInt(a / 3600);
                return (b -= 60 * c), (b = b < 10 ? "0" + b : b), (0 == c ? "" : c + "h ") + (0 == b ? "" : b + "m");
            },
            getAdditionalDate: function (a, c) {
                if (b(c).isAfter(a) || b(c).isBefore(a)) return b(c).format("DD MMM");
            },
            getDateDifferenceInDays: function (a, c) {
                return b(c).diff(b(a), "days");
            },
            onCircleMouseOver: function (a) {
                var b = d(a).closest(".js-booking-data-main"),
                    c = b.attr("id").split("-"),
                    e = "#js-fi-" + c[2] + "-" + d(a).data("index"),
                    f = d(a).data("fk").split(","),
                    g = { data: this.results[this.searchIndex].getResultsHavingFkeys(f), AL: this.results[this.searchIndex].getSingleTypeResults("AL"), AP: this.results[this.searchIndex].getSingleTypeResults("AP") };
                if (b.find(".resultdetailboxInd, .js-grouped-flights").is(":visible")) {
                    d(a).find("jq-popover-title").popover("hide");
                    for (var h in f) {
                        var i = f[h],
                            j = b.find("#fk-" + i).addClass("css-hover-green");
                        (j = j.hasClass("js-tab-sepatator-indicator") ? j : j.closest(".js-tab-sepatator")), 0 === j.next().length && b.find(".js-down-arrow").addClass("css-hover-green");
                    }
                } else d(a).find("jq-popover-title").popover("show"), d(a).data("loaded") || (d(a).data("loaded", !0), this.view({ src: "at.flights.grpf.popup.html", selector: e, data: g }));
            },
            onTimelineDurationDivMouseOver: function (a, b) {
                var c = d(b).closest("jq-popover"),
                    e = "#js-fi-" + c.data("index"),
                    f = c.data("fk").split(","),
                    g = { data: this.results[this.searchIndex].getResultsHavingFkeys(f), AL: this.results[this.searchIndex].getSingleTypeResults("AL"), AP: this.results[this.searchIndex].getSingleTypeResults("AP") };
                c.closest(".js-tab-sepatator").find(".resultdetailbox").is(":visible") || (d(b).closest("jq-popover-title").popover("show"), this.view({ src: "at.flights.grpf.popup.html", selector: e, data: g }));
            },
            onTimelineDurationDivMouseOut: function (a, b) {
                d(b).closest("jq-popover").find("jq-popover-title").popover("hide");
            },
            onCircleMouseOut: function (a) {
                var b = d(a).closest("jq-popover"),
                    c = d(a).closest(".js-booking-data-main, .js-timeline-details-popover"),
                    e = c.attr("id").split("-"),
                    f = (e[2], b.data("index"), b.data("fk").split(","));
                for (var g in f) {
                    var h = f[g];
                    c.find("#fk-" + h).removeClass("css-hover-green"), c.find(".js-down-arrow").removeClass("css-hover-green");
                }
                d(a).closest("jq-popover").find("jq-popover-title").popover("hide");
            },
            onGroupFlightsMouseOver: function (a, b) {
                var c = d(b).attr("id").slice(3);
                this.$$.find("jq-popover[data-fk*='" + c + "'] jq-popover-title")
                    .removeClass("css-fl-circle-gray")
                    .addClass("css-fl-circle-green");
            },
            onGroupFlightsMouseOut: function (a, b) {
                var c = d(b).attr("id").slice(3);
                this.$$.find("jq-popover[data-fk*='" + c + "'] jq-popover-title")
                    .removeClass("css-fl-circle-green")
                    .addClass("css-fl-circle-gray");
            },
            preventToggle: function (a) {
                (a.SAMEFAREOPTIONCLICK = !0), (a.MOREOPTIONCLICK = !0);
            },
            onSameIntlFareOptionClick: function (a, b, c) {
                this.results[0].getSameFareUniqueLegs(c.fk, c.gid);
                var d = "#js-same-fare-content-" + c.gid;
                this.loadSameFarePopOverTemplate(d, c.gid);
            },
            checkAllowedFlights: function (a, b, c) {
                if (d(b).hasClass("disabledTab")) return preventPropagation(a);
                var e = this,
                    f = c.id.split("-"),
                    g = f[0],
                    h = 1 * f[1],
                    i = d(b).closest(".resultboxdiv");
                this.results[0].getSameFareAllowedLegs(c.lfk, h, g);
                var j = this.results[0].getSelectedLegsCombination(g);
                this.updateInternationalResult(b, j, c.lfk, g, h), i.find("jq-popover[data-gid='" + g + "']").attr("data-fk", j), i.find(".js-pin-flight, .js-book-flight, .js-save-to-trips").attr("data-fk", j);
                var k = "#js-same-fare-content-" + g,
                    l = this.results[0].intlSameFareLegs,
                    m = this.results[0].selectedLegs,
                    n = this.results[0].allowedLegs,
                    o = "whiteTab disabledTab greenTab";
                for (var p in l)
                    for (var q in l[p])
                        m[p] == l[p][q]
                            ? e.$$.find(k)
                                  .find('[data-lfk="' + l[p][q] + '"]')
                                  .removeClass(o)
                                  .addClass("greenTab")
                            : -1 == n[p].indexOf(l[p][q])
                            ? e.$$.find(k)
                                  .find('[data-lfk="' + l[p][q] + '"]')
                                  .removeClass(o)
                                  .addClass("disabledTab")
                            : e.$$.find(k)
                                  .find('[data-lfk="' + l[p][q] + '"]')
                                  .removeClass(o)
                                  .addClass("whiteTab");
                return preventPropagation(a);
            },
            loadSameFarePopOverTemplate: function (a, b) {
                var c = this,
                    d = this.results[0].intlSameFareLegs,
                    e = this.results[0].intlResultsLegsObj,
                    f = this.results[0].intlResultsFlightsObj,
                    g = this.results[0].selectedLegs,
                    h = this.results[0].allowedLegs,
                    i = this.results[0].airlineDetails,
                    j = this.results[0].airportDetails,
                    k = { legKeys: d, legObj: e, flightObj: f, gid: b, selectedLegs: g, allowedLegs: h, alData: i, apData: j };
                return this.loadWithScroll({ src: "international/at.flights.international.popup.html", selector: a, data: k }).done(function () {
                    c.applyTooltip();
                });
            },
            changeIconClass: function (a, b, c, d, e) {
                b
                    ? a
                          .find(c)
                          .removeClass()
                          .addClass("icon " + d + " flights--tooltip")
                          .attr("title", e)
                          .attr("data-placement", "bottom")
                    : a.find(c).removeClass().attr("title", "").attr("data-placement", "bottom");
            },
            getRefundableIconHTML: function (a) {
                var b = this,
                    c =
                        (a.leg.filter(function (a) {
                            return 1 == b.results[0].superResults.ldet[a].fcp;
                        }).length,
                        a.rfd_plcy.rfd);
                return (
                    "object" == typeof c && Object.values(c)[0],
                    "-9" == ("object" == typeof c ? Object.values(c)[0] : c)
                        ? '<span><i class="icon icon_non-refundable flights--tooltip" title="Unknown Refundable Status"></i><sup class="css-unknown-refundable-sup-star">*</sup></span>'
                        : "0" == ("object" == typeof c ? Object.values(c)[0] : c)
                        ? '<span><i class="icon icon_non-refundable flights--tooltip" data-placement="bottom" title="Non Refundable"></i></span>'
                        : '<span><i class="">&nbsp;</i></span>'
                );
            },
            updateQualityIcons: function (a, b) {
                var c = this;
                "1" == b.fsr
                    ? a
                          .find(".js-seats span")
                          .removeClass()
                          .addClass("css-fl-radius-circle css-fl-" + b.seats + "-bg flights--tooltip")
                          .attr("title", b.seats + " " + (1 == b.seats ? " seat " : " seats ") + " remaining")
                          .attr("data-placement", "bottom")
                          .find("i")
                          .text(b.seats)
                    : a.find(".js-seats span").removeClass().find("i").text("").removeClass().attr("title", "").attr("data-placement", ""),
                    b.coa > 0
                        ? c.changeIconClass(a, b.coa > 0, ".js-switch i", "icon_change-airport", b.coat)
                        : b.cot > 0
                        ? c.changeIconClass(a, b.cot > 0, ".js-switch i", "icon_switch-terminal", b.cott)
                        : a.find(".js-switch i").removeClass().attr("title", "").attr("data-placement", ""),
                    c.changeIconClass(a, b.ovngt > 0, ".js-ovngt i", "icon_overnight", b.ovngtt),
                    c.changeIconClass(a, b.slo > 0, ".js-slo i", "icon_short-lay", b.slot),
                    c.changeIconClass(a, b.llow > 0, ".js-llow i", "icon_long-layover", b.llowt),
                    c.changeIconClass(a, 0 == b.lg, ".js-lg i", "icon_no-luggage", "No Baggage"),
                    a.find(".js-rfd").html(c.getRefundableIconHTML(b)),
                    "e" == b.fcc
                        ? c.changeIconClass(a, "e" == b.fcc, ".js-cc i", "icon_economy", "Economy Class")
                        : "pe" == b.fcc
                        ? c.changeIconClass(a, "pe" == b.fcc, ".js-cc i", "icon_premium-economy", "Premium Economy Class")
                        : "f" == b.fcc
                        ? c.changeIconClass(a, "f" == b.fcc, ".js-cc i", "icon_first-class", "First Class")
                        : "b" == b.fcc
                        ? c.changeIconClass(a, "b" == b.fcc, ".js-cc i", "icon_business-class", "Business Class")
                        : a.find(".js-cc i").removeClass().attr("title", "");
            },
            updateAirlineLogo: function (a, b, c) {
                var d = "";
                if (1 == b.al.length) d = '<div class="css-fl-logo-box-27"><img src="' + IMAGE_PATH + "/" + b.al[0] + '.png" width="25px" height="25px"></div>';
                else {
                    d = '<div class="css-fl-logo-box-20">';
                    for (var e in b.al) e < 3 && (d += '<img src="' + IMAGE_PATH + "/" + b.al[e] + '.png" width="20px" height="20px" class="flights--tooltip" title="' + c[b.al[e]] + '">');
                    d += "</div>";
                }
                a.find(".css-fl-logo-boxes").html(""), a.find(".css-fl-logo-boxes").append(d), a.find(".css-fl-logo-name-section").text(b.al.length > 1 ? "Multi Carriers (" + b.al.length + ")" : c[b.al[0]]);
            },
            updateDepartureDetails: function (a, b, c) {
                var d = "";
                if (b.all_ap.length > 2)
                    for (var e in b.all_ap) {
                        var f = b.all_ap[e];
                        (d += '<span class="flights--tooltip"  title="' + (c[f] ? c[f].n + ", " + c[f].c + ", " + c[f].cn : "") + '"> ' + f + " </span>"), (d += e < b.all_ap.length - 1 ? " → " : "");
                    }
                else d = '<span class="flights--tooltip" title="' + (c[b.ap[0]] ? c[b.ap[0]].n + ", " + c[b.ap[0]].c + ", " + c[b.ap[0]].cn : "") + '"> ' + b.ap[0] + " </span>";
                a.find(".css-fl-destination-time.js-dt .css-fl-time").text(b.dt).siblings(".css-fl-destination").html(d);
            },
            updateArrivalDetails: function (a, b, c) {
                b.all_ap.length <= 2
                    ? a
                          .find(".css-fl-destination-time.js-at .css-fl-time")
                          .text(b.at)
                          .append(" <i></i>")
                          .siblings(".css-fl-destination")
                          .find("span")
                          .text(b.ap.slice(-1))
                          .addClass("flights--tooltip")
                          .attr("title", c[b.ap.slice(-1)].n + ", " + c[b.ap.slice(-1)].c + ", " + c[b.ap.slice(-1)].cn)
                    : a.find(".css-fl-destination-time.js-at .css-fl-time").text(b.at).append(" <i></i>").siblings(".css-fl-destination").find("span").text("").removeClass("flights--tooltip").attr("title", "");
                var d = this.getAdditionalDate(b.dd, b.ad);
                void 0 !== d && a.find(".css-fl-destination-time.js-at i").text(d);
            },
            updateInternationalResult: function (a, b, c, e) {
                var f,
                    g = this,
                    h = this.results[0].origResults[b],
                    i = this.results[0].intlResultsFlightsObj,
                    j = this.results[0].airlineDetails,
                    k = this.results[0].airportDetails,
                    l = d(a).closest(".resultboxdiv");
                l.find(".js-booking-data").attr("data-fk", b);
                for (var m in h.leg) {
                    var n = h.leg[m],
                        o = this.results[0].intlResultsLegsObj[n],
                        p = l.find(".js-result-box-" + e + "-" + m);
                    g.updateQualityIcons(p, h), g.updateAirlineLogo(p, o, j), g.updateDepartureDetails(p, o, k), g.updateArrivalDetails(p, o, k);
                    var q = p.find(".css-fl-duration").children(".css-fl-duration-time").text(g.formatDuration(o.tt));
                    o.fastest ? q.addClass("css-fl-cheapest-background").attr("title", "Fastest flight") : q.removeClass("css-fl-cheapest-background").attr("title", ""),
                        (f = 0 == o.stp ? "Non Stop" : 1 == o.stp ? o.stp + " Stop" : o.stp + " Stops"),
                        p.find(".css-fl-duration-stop").text(f),
                        g.$$.find(".flights--tooltip").tooltip({ placement: "bottom" });
                    var r = l
                            .siblings(".js-toggle-box")
                            .find(".js-leg-detail-" + e + "-" + m)
                            .data("x"),
                        s = { fk: b, led: h.led[n], resultObj: h, legObj: o, fdet: i, alData: j, apData: k, tabCount: r, legCount: m, totalLegs: g.totalLegs };
                    0 !== l.siblings(".js-toggle-box").find(".js-hidden-result-detail").length &&
                        this.load({ src: "international/at.flights.international.leg.detail.html", selector: ".js-leg-detail-" + e + "-" + m, data: s }).done(function () {
                            for (var a = o.flights.length - 1; a >= 0; a--) {
                                var c = o.flights[a],
                                    d = { origin: i[c].fr, destination: i[c].to, airline: i[c].al, flight_number: i[c].fn };
                                g.loadDelayIndexTemplate(d, c);
                            }
                            g.$$.find("#js-jq-tab-" + r).val(""),
                                g.$$.find("#js-jq-tab-" + r).val("flight-info-" + r),
                                g.$$.find("#js-jq-tab-" + r)
                                    .find("jq-tab-head[value=baggage-info-" + r + "], jq-tab-head[value=amenities-info-" + r + "], jq-tab-head[value=refund-policy-" + r + "]")
                                    .attr("data-fk", b),
                                g.applyTooltip();
                        });
                }
            },
            openMultiBaggagePopover: function () {
                var a = this;
                -1 == a.selectedFlights.indexOf(0) && a.view({ src: "at.flights.multi.baggage.policy.html", data: a.selectedFlights, selector: "#js-multi-baggage-popover-content" });
            },
            setSelectedFlightsTaxes: function () {
                for (var a = this, b = 0; b < a.selectedFlights.length; b++) a.selectedFlights[b].taxes = a.results[b].taxes;
            },
            hideTaxes: function (a) {
                var b = [];
                return is.Object(a) ? (b = _.uniq(a.al)) : is.Array(a) && (b = _.uniq([].concat.apply([], _.pluck(a, "al")))), "6E" == b[0] && 1 == b.length;
            },
            getCombinedFareBreakup: function () {
                var a = this,
                    b = { farepr: a.selectedFlights[0].farepr, fare: JSON.parse(JSON.stringify(a.selectedFlights[0].fare)), isCombo: !1 };
                if (((b.hideTaxes = a.hideTaxes(a.selectedFlights)), this.selectedComboFare))
                    (b.farepr = this.selectedComboFare.farepr), (b.fare = this.selectedComboFare.fare), (b.isCombo = !0), (b.refundPolicy = this.selectedComboFare.rfd_plcy);
                else for (var c = 1; c < this.selectedFlights.length; c++) (b.farepr += 1 * a.selectedFlights[c].farepr), (b.fare = a.recursiveLoopToAddFares(b.fare, a.selectedFlights[c].fare));
                return b;
            },
            recursiveLoopToAddFares: function (a, b) {
                var c = this;
                a = a || {};
                for (var d in b)
                    if ("object" == typeof b[d]) a[d] = c.recursiveLoopToAddFares(a[d], b[d]);
                    else if (is.Number(a[d]) || is.Number(b[d])) {
                        var e = is.Empty(a[d]) ? 0 : 1 * a[d],
                            f = is.Empty(b[d]) ? 0 : 1 * b[d];
                        a[d] = e + f;
                    }
                return a;
            },
            showMoreOptions: function (a) {
                d(a.target).closest(".js-tab-sepatator, .js-tab-sepatator-indicator").find(".js-more-option").show();
            },
            hideMoreOptions: function (a) {
                var b = d(a.target).closest(".js-tab-sepatator,.js-tab-sepatator-indicator").find(".js-more-option");
                b.hide(), b.closest("jq-popover-title").popover("hide");
            },
            getSharableText: function (a, c) {
                var d = this,
                    e = a.pinnedFlights,
                    f = [],
                    h = "",
                    i = !1;
                (h = h.concat(1 == e.length ? "Flight Option for " : "Flight Options for ")), (h = h.concat(a.sectorName)), f.push(h), f.push("for " + b(e[0].dd).format("ddd, DD MMM, YYYY")), f.push(" ");
                for (var j in e) {
                    h = "";
                    var k = g.format.amount(e[j].farepr, "", "json"),
                        l = k.class.split(" ")[1].split("-")[1].toUpperCase();
                    (l = "INR" == l ? "₹" : "USD" == l ? "$" : l + " "),
                        (h = "*" + (j - 1 + 2) + ". " + l + k.value + "*"),
                        f.push(h),
                        _.map(e[j].leg, function (c) {
                            var e = "",
                                g = [];
                            _.map(c.flights, function (f, h) {
                                var j = "",
                                    k = new Array(d.getDateDifferenceInDays(f.dd, f.ad) + 1).join("#");
                                (i = i || d.getDateDifferenceInDays(f.dd, f.ad) > 0),
                                    h > 0 && g.push("-- *Layover in " + f.fr + ": " + d.formatDuration(c.lott[h - 1]) + "* --"),
                                    (e += h > 0 ? "+ " : ""),
                                    (e += void 0 != a.alData[f.al] ? a.alData[f.al].substr(0, 13) : ""),
                                    (e += " (" + f.al + "-" + f.fn + ") "),
                                    (j += f.fr),
                                    (j += " *" + b({ h: f.dt.split(":")[0], m: f.dt.split(":")[1] }).format("hh:mm A") + " - "),
                                    (j += b({ h: f.at.split(":")[0], m: f.at.split(":")[1] }).format("hh:mm A") + k + "* "),
                                    (j += f.to),
                                    (j += " (" + d.formatDuration(f.ft) + ")"),
                                    g.push(j),
                                    f.halt_time && g.push("(Halt at " + f.halt + " for " + d.formatDuration(f.halt_time) + ")");
                            }),
                                f.push(e),
                                (f = f.concat(g));
                        }),
                        f.push(" ");
                }
                if ((i && f.push("# - Arrives next day"), "C" == c)) {
                    const m = document.createElement("textarea");
                    for (var n in f) m.value += f[n] + "\n";
                    document.body.appendChild(m), m.select(), document.execCommand("copy"), document.body.removeChild(m), g.alert.show("Flight Details has been copy to your clipboard.", "success");
                } else {
                    var o = "";
                    for (var n in f) o += f[n].replace("#", "%23") + "%0D%0A";
                    window.open("https://api.whatsapp.com/send?text=" + o);
                }
            },
            openPinnedEmailPopup: function (a, b) {
                var e = this,
                    f = [],
                    g = {};
                if (d(b).hasClass("css-active")) return this.$$.find("#js-pinned-email-content").slideUp(100), this.$$.find(".js-pinned-hidden-options").removeClass("css-active"), void d(".css-popup-overlay").remove();
                if ((e.$$.find(".js-pinned-hidden-options").removeClass("css-active"), d(b).addClass("css-active"), "S" == e.searchType)) {
                    f = e.results[e.searchIndex].getFilteredResults().PF;
                } else {
                    var h = e.results[0].superResults.resKeys.PF;
                    for (var i in h) {
                        f[i] = JSON.parse(JSON.stringify(e.results[0].superResults.rdet[h[i]]));
                        var j = e.results[0].superResults.rdet[h[i]];
                        for (var k in j.leg) {
                            f[i].leg[k] = JSON.parse(JSON.stringify(e.results[0].superResults.ldet[j.leg[k]]));
                            var l = e.results[0].superResults.ldet[j.leg[k]];
                            for (var m in l.flights) f[i].leg[k].flights[m] = JSON.parse(JSON.stringify(e.results[0].superResults.fdet[l.flights[m]]));
                        }
                    }
                }
                if (
                    ((g = {
                        pinnedFlights: f,
                        alData: e.results[0].airlineDetails,
                        apData: e.results[0].airportDetails,
                        taxes: e.results[0].taxes,
                        searchType: e.searchType,
                        sectorName: e.sectorName,
                        sectorDate: e.sectorDate,
                        type: d(b).hasClass("js-print-pinned-flights") ? "P" : "E",
                    }),
                    d(b).hasClass("js-copy-pinned-flights") || d(b).hasClass("js-whatsapp-pinned-flights"))
                )
                    this.getSharableText(g, d(b).hasClass("js-copy-pinned-flights") ? "C" : "W");
                else if ((0 === d(".css-popup-overlay").length && d("body").append('<div class="css-popup-overlay"></div>'), e.login.isAgent() || e.login.isCorporate()))
                    e.load({ src: "at.flights.pinned.email.template.html", data: { type: "Q", email: e.login.getUserMeta().email }, selector: "#js-pinned-email-content" }).done(function () {
                        e.$$.find("#js-pinned-email-content").slideDown(100);
                    });
                else {
                    for (var n = location.href, o = (n.match(/PF%5B%5D/g) || []).length, p = 0; p < o; p++) n = n.replace("PF%5B%5D", "PF%5B" + p + "%5D");
                    ["dep_dt", "ar_dt", "pr", "stp", "loap", "al", "tt", "lott", "ap", "fq", "eq", "fares"].forEach(function (a) {
                        for (var b = 0; n.indexOf("%5B" + a + "%5D%5B%5D") > -1; ) n = n.replace("%5B" + a + "%5D%5B%5D", "%5B" + a + "%5D%5B" + b++ + "%5D");
                    }),
                        c.fetchFlightShortURL({ u: n }).done(function (a) {
                            a.success && (g.shortURL = a.data.u),
                                e.load({ src: "at.flights.pinned.email.template.html", data: g, selector: "#js-pinned-email-content" }).done(function () {
                                    e.$$.find("#js-pinned-email-content").slideDown(100);
                                });
                        });
                }
            },
            openSingleFlightEmailPopup: function (a, b, c) {
                var e = this,
                    f = [],
                    g = c.fk || d(b).closest(".js-more-option-dd").data("fk"),
                    h = c.type,
                    j = {};
                if ("S" == e.searchType) f[0] = e.results[e.searchIndex].getResultsHavingFkey(g);
                else if ("D" == e.flightType) {
                    var k = { farepr: 0, leg: [] };
                    e.selectedFlights.map(function (a) {
                        (k.farepr += a.farepr), k.leg.push(a.leg[0]);
                    }),
                        (f[0] = k);
                } else {
                    var l = [g];
                    for (var m in l) {
                        f[m] = JSON.parse(JSON.stringify(e.results[0].superResults.rdet[l[m]]));
                        var n = e.results[0].superResults.rdet[l[m]];
                        for (var o in n.leg) {
                            f[m].leg[o] = JSON.parse(JSON.stringify(e.results[0].superResults.ldet[n.leg[o]]));
                            var p = e.results[0].superResults.ldet[n.leg[o]];
                            for (var q in p.flights) f[m].leg[o].flights[q] = JSON.parse(JSON.stringify(e.results[0].superResults.fdet[p.flights[q]]));
                        }
                    }
                }
                return (
                    (j = {
                        pinnedFlights: f,
                        alData: e.results[0].airlineDetails,
                        apData: e.results[0].airportDetails,
                        taxes: e.results[0].taxes,
                        searchType: e.searchType,
                        sectorName: e.sectorName,
                        sectorDate: e.sectorDate,
                        type: "print" == h ? "P" : "E",
                    }),
                    e.add(i.instance({ id: "js-email-print-popup", src: "/flights/at.flights.pinned.email.template.html", data: j })),
                    d(b).closest("jq-popover").find("jq-popover-title").popover("hide"),
                    (a.PRINTCLICK = !0)
                );
            },
            showCcInputField: function (a, b) {
                d(b).hasClass("js-email-top-cc") ? (this.$$.find(".js-top-cc-bcc").hide(), this.$$.find(".js-cc-input-field").show()) : (d(b).hide(), this.$$.find(".js-cc-input-field").show().find(".icon-right").hide());
            },
            showBccInputField: function (a, b) {
                d(b).hasClass("js-email-top-bcc") ? (this.$$.find(".js-top-cc-bcc").hide(), this.$$.find(".js-bcc-input-field").show()) : (d(b).hide(), this.$$.find(".js-bcc-input-field").show().find(".icon-right").hide());
            },
            emailValidator: function (a, b) {
                d(b).closest(".css-error-border").removeClass("css-error-border"),
                    is.Empty(d(b).val()) || this.validator.email(d(b).val())
                        ? (d(b).closest(".css-fields-input").removeClass("css-error-border"), d(b).closest(".css-to-feild").next(".css-error-msgs").hide())
                        : (d(b).closest(".css-fields-input").addClass("css-error-border"), d(b).closest(".css-to-feild").next(".css-error-msgs").show());
            },
            sendPinnedFlightsInEmail: function (a, b) {
                var e = this,
                    f = e.$$.find("#pinned-flights-email-cc"),
                    h = e.$$.find("#pinned-flights-email-bcc"),
                    i = e.$$.find("#pinned-flights-email-to"),
                    j = e.$$.find("#pinned-flights-email-from"),
                    k = e.$$.find("#js-pinned-flights-email-content").html(),
                    l = e.$$.find("#management-fee-flag"),
                    m = "",
                    n = {};
                if ((e.$$.find(".css-error-border").removeClass("css-error-border"), e.$$.find(".js-from-input-error,.js-to-input-error,.js-cc-input-error,.js-bcc-input-error").hide(), e.login.isAgent() || e.login.isCorporate())) {
                    var o = this.jqrouter.getQueryParam("PF");
                    (n.options = this.results[0].getAllPinnedFks(o)), (n.show_mfee = l[0].checked), (n.sid = e.sid), (m = "sharePinnedFlights");
                } else
                    (n = { from: "talk@aertrip.com", subject: e.$$.find("#pinned-flights-email-subject").val(), fk: e.$$.find("#pinned-flights-fk").data("fk").split(","), type: "pinnedFlights", template: JSON.stringify(k) }),
                        is.Empty(j.val()) ? (j.parent().parent().addClass("css-error-border"), e.$$.find(".js-from-input-error").show()) : (n.from_name = j.val()),
                        (m = "sendPinnedFlightsEmail");
                this.validator.email(i.val()) ? (n.to = [i.val()]) : (i.parent().parent().addClass("css-error-border"), e.$$.find(".js-to-input-error").show()),
                    is.Empty(f.val()) || (this.validator.email(f.val()) ? (n.cc = [f.val()]) : (f.parent().parent().addClass("css-error-border"), e.$$.find(".js-cc-input-error").show())),
                    is.Empty(h.val()) || (this.validator.email(h.val()) ? (n.bcc = [h.val()]) : (h.parent().parent().addClass("css-error-border"), e.$$.find(".js-bcc-input-error").show())),
                    0 === this.$$.find("#js-pinned-email-content,.js-pinned-email-content").find(".css-error-border").length &&
                        (d(b).addClass("loading").prop("disabled", !0),
                        c[m](n)
                            .done(function (a) {
                                d(b).addClass("loading").prop("disabled", !0),
                                    a.success
                                        ? (d(".css-popup-overlay").remove(),
                                          e.$$.find("#js-pinned-email-content").slideUp(100),
                                          e.$$.find(".js-pinned-hidden-options").removeClass("css-active"),
                                          e.remove("js-email-print-popup"),
                                          g.alert.show("Mail successfully sent", "success"))
                                        : g.alert.show(g.getErrorMsg("flights", a.errors, "sendPinnedFlights"), "error");
                            })
                            .fail(function () {
                                d(b).addClass("loading").prop("disabled", !0);
                            }));
            },
            PrintDiv: function () {
                var a = this,
                    b = a.$$.find("#js-pinned-flights-email-content").html(),
                    c = document.createElement("iframe");
                (c.name = "frame1"), (c.style.position = "absolute"), (c.style.top = "-1000000px"), document.body.appendChild(c);
                var d = c.contentWindow ? c.contentWindow : c.contentDocument.document ? c.contentDocument.document : c.contentDocument;
                return (
                    d.document.open(),
                    d.document.write("<html><head><title>Aertrip Pinned Flights</title>"),
                    d.document.write("</head><body>"),
                    d.document.write(b),
                    d.document.write("</body></html>"),
                    d.document.close(),
                    setTimeout(function () {
                        window.frames.frame1.focus(), window.frames.frame1.print(), document.body.removeChild(c);
                    }, 500),
                    !1
                );
            },
            getResultsDivWidth: function () {
                return d("#flightsResults").width();
            },
            searchAirports: function (a) {
                c.searchAirports({ q: a.detail.term }).done(function (b) {
                    var c = b.data,
                        d = [];
                    for (var e in c) (d[e] = {}), (d[e].id = c[e].iata), (d[e].iata = c[e].iata), (d[e].city = c[e].city), (d[e].country = c[e].country), (d[e].airport = c[e].airport);
                    a.detail.callback(d);
                });
            },
            animateFare: function (a, b, c) {
                d({ value: b }).animate(
                    { value: c },
                    {
                        duration: 500,
                        easing: "swing",
                        step: function () {
                            d(a).html(g.format.amount(this.value, null, "valueHTML"));
                        },
                        complete: function () {
                            parseInt(d(a).text()) !== c && d(a).replaceWith(g.format.amount(c, null, "valueTag"));
                        },
                    }
                );
            },
            pinnedFlightsClick: function (a) {
                a.PINNEDFLIGHTSCLICK = !0;
            },
            documentClick: function (a, b, c) {
                void 0 === c || c.PINNEDFLIGHTSCLICK || this.closePinnedEmailPopup(a, "document");
            },
            closePinnedEmailPopup: function (a, b) {
                return (
                    this.$$.find("#js-pinned-email-content").slideUp(100),
                    this.$$.find(".js-pinned-hidden-options").removeClass("css-active"),
                    d(".css-popup-overlay").remove(),
                    "document" != b && this.remove("js-email-print-popup"),
                    preventPropagation(a)
                );
            },
            saveToTrips: function (a) {
                return (a.SAVETOTRIPSCLICK = !0);
            },
            getFlightDetailsForTrips: function (a) {
                var b = this,
                    c = [],
                    d = 0;
                if ("S" != b.searchType && "D" == b.flightType)
                    for (var e in b.selectedFlights) {
                        for (var f in b.selectedFlights[e].leg)
                            for (var g in b.selectedFlights[e].leg[f].flights) {
                                var h = b.selectedFlights[e].leg[f].flights[g];
                                c.push(b.getFlightsFormatedDataForTrips(h));
                            }
                        d += b.selectedFlights[e].farepr;
                    }
                else if ("S" == b.searchType) {
                    var i = b.results[b.searchIndex].getResultsHavingFkey(a.fk);
                    d = i.farepr;
                    for (var e in i.leg[0].flights) c.push(b.getFlightsFormatedDataForTrips(i.leg[0].flights[e]));
                } else {
                    var j = b.results[0].superResults;
                    d = j.rdet[a.fk].farepr;
                    for (var e in j.rdet[a.fk].leg) {
                        var k = j.rdet[a.fk].leg[e];
                        for (var f in j.ldet[k].flights) {
                            var l = j.ldet[k].flights[f];
                            c.push(b.getFlightsFormatedDataForTrips(j.fdet[l]));
                        }
                    }
                }
                return { eventsData: c, total_cost: d };
            },
            getFlightsFormatedDataForTrips: function (a) {
                return {
                    airline_code: a.al,
                    depart_airport: a.fr,
                    arrival_airport: a.to,
                    flight_number: a.fn,
                    depart_terminal: a.dtm,
                    arrival_terminal: a.atm,
                    cabin_class: a.cc,
                    depart_dt: a.dd,
                    depart_time: a.dt,
                    arrival_dt: a.ad,
                    arrival_time: a.at,
                    equipment: a.eq,
                    timezone: "Automatic",
                };
            },
            getDelayIndex: function (a) {
                return c.getDelayIndex(a);
            },
            toggleHumaneResults: function (a, b, c) {
                var e,
                    f = this;
                d(b).find("div:first").hide().next().show(),
                    (e =
                        "I" == f.flightType
                            ? is.Empty(f.results[c.index].intlModFilters[c.index])
                                ? []
                                : f.results[c.index].intlModFilters[c.index].fq.value
                            : is.Empty(f.results[c.index].modFilterData)
                            ? []
                            : f.results[c.index].modFilterData.fq.value),
                    -1 === e.indexOf("aht")
                        ? (e.push("aht"), f.results[c.index].updateFilter("fq", e))
                        : ((e = e.filter(function (a) {
                              return "aht" != a;
                          })),
                          f.results[c.index].updateFilter("fq", e)),
                    setTimeout(function () {
                        f.filterInstance.changeFilterCount(),
                            f.filterInstance.render(),
                            "S" == f.searchType ? f.showResults(f.results[0].getFilteredResults()) : "I" == f.flightType ? f.showResults(f.results[0].superResults) : ("R" != f.searchType && "M" != f.searchType) || f.showMultiResults(!0);
                    }, 100);
            },
            toggleHumaneDisplayDiv: function (a, b, c) {
                (a = a.show().find("div:first")),
                    "Show" == c ? a.find("span:first i").removeClass("icon_arrow-up").addClass("icon_arrow-down") : a.find("span:first i").removeClass("icon_arrow-down").addClass("icon_arrow-up"),
                    a.find("span:last").text(c + " " + b + " longer or more expensive flight" + (b > 1 ? "s" : "")),
                    a.show().next().hide();
            },
            changeTravelDateShortcut: function (a, c, e) {
                var f,
                    g = d(c).hasClass("js-next-date") ? "next" : "prev",
                    h = is.Empty(e.index) ? "0" : e.index;
                this.jqrouter.setQueryParam("index", h),
                    "R" == this.searchType && "1" == h
                        ? ((f = this.jqrouter.getQueryParam("return")), (f = this.changeDate(f, g)), this.jqrouter.setQueryParam("return", f))
                        : "M" == this.searchType
                        ? ((f = this.jqrouter.getQueryParam("depart")), (f[h] = this.changeDate(f[h], g)), this.jqrouter.setQueryParam("depart", f))
                        : ((f = this.jqrouter.getQueryParam("depart")), (f = this.changeDate(f, g)), this.jqrouter.setQueryParam("depart", f)),
                    "R" == this.searchType || "M" == this.searchType
                        ? (this.modifyMultiReturn(c, f, h), this.setPrevNextDateNavigation())
                        : (this.$$.find(".js_results_sorted").html('<div class="css-error-cont"><div class="css-modify-search">Looking for best flights for you..</div></div>').next().remove(),
                          0 === b(f, "DD-MM-YYYY").diff(b().format("YYYY-MM-DD"), "days") && this.$$.find(".js-prev-date").addClass("css-disable-color"));
            },
            modifyMultiReturn: function (a, c, e) {
                var f = d(a).closest(".flightsHeadings");
                f.find(".depDate").text(b(c, "DD-MM-YYYY").format("DD MMM YYYY")),
                    f.siblings("#js-flights-leg-" + e).html('<div class="css-error-cont"><div class="css-modify-search">Looking for best flights for you..</div></div>'),
                    f.siblings(".js-toggle-humane-results").hide(),
                    is.Empty(this.selectedFlights) || (this.selectedFlights[e] = 0),
                    this.changeMultiResultHeader(e);
            },
            changeDate: function (a, c) {
                return (a = "next" == c ? b(a, "DD-MM-YYYY").add(1, "days").format("DD-MM-YYYY") : b(a, "DD-MM-YYYY").subtract(1, "days").format("DD-MM-YYYY"));
            },
            openHumaneSortInfo: function (a) {
                return preventPropagation(a);
            },
            openSmartSortLearnMore: function () {
                window.open("/smart-sort", "_blank");
            },
            openBrandedFaresPopup: function (a) {
                a.BRANDEDFARECLICK = !0;
            },
            getAllAirportDetails: function () {
                var a = {};
                if ("I" == this.flightType && "S" != this.searchType) d.extend(a, this.results[0].airportDetails);
                else for (var b = 0; b < this.totalLegs; b++) d.extend(a, this.results[b].airportDetails);
                return a;
            },
            getAllAirlineDetails: function () {
                var a = {};
                if ("I" == this.flightType && "S" != this.searchType) d.extend(a, this.results[0].airlineDetails);
                else for (var b = 0; b < this.totalLegs; b++) d.extend(a, this.results[b].airlineDetails);
                return a;
            },
            arraySum: function (a) {
                if (is.Empty(a)) return 0;
                if (is.Array(a)) {
                    var b = 0;
                    for (var c in a) b += 1 * a[c];
                    return b;
                }
                return is.String(a) || is.Number(a) ? parseFloat(a) : 0;
            },
            checkPieceInBaggage: function () {
                function a(b) {
                    if (is.String(b) && b.toLowerCase().match(/pieces?|pcs?/)) return !0;
                    if ("object" == typeof b) for (var c in b) return is.Object(b[c]) ? !(!b[c].hasOwnProperty("pieces") || is.Empty(b[c].pieces) || !is.Empty(b[c].weight) || !is.Empty(b[c].max_weight)) : !!a(b[c]);
                }
                return a(arguments);
            },
            getArrivalLabel: function (a, b, c) {
                var d = this.getDateDifferenceInDays(a, b),
                    e = "";
                return (
                    d > 0 ? (e = "Arrives " + (1 == d ? " Next Day " : " After " + d + " Days")) : d < 0 && (e = "Arrives " + (-1 == d ? " Previous Day " : " Before " + d + " Days")),
                    c ? e : e ? '<span><label class="labels arrivalLabelBg"> ' + e + " </label></span>" : ""
                );
            },
            getEquipmentIcon: function (a) {
                var b = "icon_flight-right";
                switch (a) {
                    case "bus service":
                        b = "icon_bus-filled";
                        break;
                    case "train":
                        b = "icon_train";
                }
                return b;
            },
            updateRefundableStatus: function (a, b, c) {
                this.results[b].updateRefundableStatus(a, c), "S" != this.searchType && "D" == this.flightType && this.renderAllResults(b, !1, !1, !0);
            },
            _remove_: function () {
                this.pipe.off(), this.jqrouter.off();
            },
        };
    }),
    _define_({ name: "at.flights.filter", extend: "spamjs.view", modules: ["at.flights.results", "at.flightservice", "at.common.functions", "jQuery", "jqbus", "jqrouter", "at.login"] }).as(function (a, b, c, d, e, f, g, h) {
        return {
            globalEvents: { "flights.search.change": "onFlightSearchFilter", "headers.non.stop.filter.change": "updateStopFilter", document_click: "documentClick" },
            events: {
                "change #js-price-range": "onPriceSliderChange",
                "slide.start #js-price-range": "onPriceSlideStart",
                "slide.start .timeRangeSlider": "onTimeSlideStart",
                "slidestop #js-price-range,.timeRangeSlider": "sliderStop",
                "click .js-reset": "resetFilter",
                "click .filterHd": "filtersToggleDisplay",
                "click input": "onFilterSelect",
                "change .timeRangeSlider": "onTimeSliderChange",
                "change .durationSlider": "onDurationSliderChange",
                "click .only": "onFilterOnlyClick",
                "mouseover .aerlineCheckbox": "showOnlyKeyword",
                "mouseout .aerlineCheckbox": "hideOnlyKeyword",
                "click .clearFilter": "clearFilter",
                "click .pagination > li": "onFilterTabSelect",
                "click .js-show-all": "toggleAllAirline",
                "change .js-multi-airline": "showMultiAirline",
                "click .js-payment-gateway": "openPayamentGatewayDD",
                "click .js-payment-gateway-dd li": "selectPaymentGateway",
                "click .js-list-timline-views span:not(.selected)": "changeListTimelineView",
            },
            _init_: function () {
                var a = this;
                (a.pipe = f.instance()), a.pipe.bind(this), (a.router = g.instance()), (a.rescheduling = a.options.rescheduling);
            },
            onFlightSearchFilter: function (a, b, c) {
                var d = this;
                (d.searchIndex = c.searchIndex), h.isCorporate() && d.updateCorporateFare(d.router.getQueryParam("corpCodeFlag")), d.render();
            },
            setSearchVariables: function (a, b, c, d, e, f) {
                this.setSearchType(b), this.setSearchInstance(a), this.setTotalLegs(c), this.setFlightType(d), this.setSearchIndex(e), (this.showTimeline = f);
            },
            setSearchType: function (a) {
                this.searchType = a;
            },
            setSearchInstance: function (a) {
                this.filters = a;
            },
            setTotalLegs: function (a) {
                this.totalLegs = a;
            },
            setFlightType: function (a) {
                this.flightType = a;
            },
            setSearchIndex: function (a) {
                this.searchIndex = a;
            },
            setDisplayGroup: function (a) {
                this.displayGroup = a;
            },
            onFilterTabSelect: function (a, b, c) {
                c.index == this.searchIndex ||
                    ("S" != this.searchType && "I" != this.flightType && is.Empty(this.filters[c.index].modFilterData)) ||
                    ((this.searchIndex = c.index), this.render(), (this.fSearch.searchIndex = c.index), this.pipe.publish("filter.leg.index.change", { index: c.index }));
            },
            render: function () {
                var a = this,
                    b = "";
                if (("I" == a.flightType ? ((a.fSearch = a.filters[0]), (b = a.fSearch.intlModFilters[a.searchIndex])) : ((a.fSearch = a.filters[a.searchIndex]), (b = a.fSearch.modFilterData)), is.Empty(b))) return !1;
                (b.searchIndex = a.searchIndex),
                    (b.searchType = a.searchType),
                    (b.total = a.totalLegs),
                    (b.flightType = a.flightType),
                    (b.fareGraph = a.fSearch.getTimeBetweenRange(a.searchIndex)),
                    (b.viewType = a.router.getQueryParam("view")),
                    (b.showTimeline = a.showTimeline),
                    a.load({ src: "at.flights.filter.html", data: b }).done(function () {
                        a.doBindings(),
                            a.fareGraphTemplate(b),
                            (b.timeGraph = a.fSearch.getFareBetweenRange(a.searchIndex, "dep_dt")),
                            a.timeGraphTemplate(b, "dep_dt"),
                            (b.timeGraph = a.fSearch.getFareBetweenRange(a.searchIndex, "ar_dt")),
                            a.timeGraphTemplate(b, "ar_dt");
                    });
            },
            fareGraphTemplate: function (a) {
                var b = "",
                    c = moment(a.dep_dt.latest),
                    d = moment(a.dep_dt.earliest),
                    e = c.hours() + 1,
                    f = d.hours(),
                    g = (60 * (e - f)) / 71.5;
                for (var h in a.fareGraph)
                    if (is.Empty(a.fareGraph[h])) b += '<div class="css-graph-circle-row js-empty-div"><span class="" style="">&nbsp;</span></div>';
                    else {
                        b += '<div class="css-graph-circle-row">';
                        var i = _.uniq(a.fareGraph[h]).slice(0, 14);
                        for (var j in i) {
                            var k = moment(a.fareGraph[h][j]).diff(d.minutes(0), "minutes");
                            k > 60 * (e - f) && (k = 60 * (e - f));
                            var l = k / g - 2.5;
                            b += '<span class="css-enable " style="bottom:' + l + 'px"></span>';
                        }
                        b += "</div>";
                    }
                this.$$.find(".js-price-dots-graph").html(b);
            },
            timeGraphTemplate: function (a, b) {
                var c = "",
                    d = parseInt(a.pr.maxPrice),
                    e = parseInt(a.pr.minPrice),
                    f = (d - e) / 70;
                for (var g in a.timeGraph)
                    if (is.Empty(a.timeGraph[g])) c += '<div class="css-graph-circle-row js-empty-div"><span class="" style="">&nbsp;</span></div>';
                    else {
                        c += '<div class="css-graph-circle-row">';
                        var h = _.uniq(a.timeGraph[g]).slice(0, 14);
                        for (var i in h) {
                            var j = a.timeGraph[g][i] - e,
                                k = j / f;
                            c += '<span class="css-enable " style="bottom:' + (k - 2) + 'px"></span>';
                        }
                        c += "</div>";
                    }
                "dep_dt" == b ? this.$$.find(".js-dep-time-graph").html(c) : this.$$.find(".js-arr-time-graph").html(c);
            },
            clearFilter: function () {
                var a = this;
                if ("I" != this.flightType)
                    for (var b = this.totalLegs - 1; b >= 0; b--) this.filters[b].clearFilter(b), a.setFiltersToQuery("clear"), this.pipe.publish("flights.filter.change", { searchIndex: b, from: "filter", action: "renderAll" });
                else this.filters[0].clearFilter(this.searchIndex), a.setFiltersToQuery("clear"), this.publish_change();
                this.render(), this.checkNonStopFilterState();
            },
            clearFilterFromResults: function (a) {
                if ("I" == this.flightType) {
                    for (var b = 0; b < this.totalLegs; b++) this.filters[0].clearFilter(b);
                    this.render(), this.setFiltersToQuery("clear");
                } else
                    "S" == this.searchType
                        ? (this.filters[0].clearFilter(), this.render(), this.setFiltersToQuery("clear"))
                        : ("M" == this.searchType && (this.searchIndex = a), this.filters[a].clearFilter(), this.render(), this.setFiltersToQuery("clearByIndex", a));
                this.checkNonStopFilterState();
            },
            checkNonStopFilterState: function () {
                1 !== this.rescheduling && this.options.checkNonStopFilterState.apply(this.options.calleeObj);
            },
            filtersToggleDisplay: function (a, b) {
                e(b).next().is(":hidden")
                    ? (e(b).addClass("active"),
                      e(b).next().slideDown("normal"),
                      this.$$.find(".css-ellipsis").each(function () {
                          d.addTooltipForEllipsis(this);
                      }))
                    : (e(b).removeClass("active"), e(b).next().slideUp("normal"));
            },
            updateStopFilter: function (a, b, c) {
                var d = this;
                if ("S" == d.searchType || "I" == this.flightType) d.filters[0].updateAllStopFilter(c.status), d.setFiltersToQuery("stp", 0), d.publish_change(0);
                else for (var e = 0; e < d.totalLegs; e++) d.filters[e].updateAllStopFilter(c.status), d.setFiltersToQuery("stp", e), d.pipe.publish("flights.filter.change", { searchIndex: e, from: "filter" });
                var f = this.$$.find(".js-stp .stopsCheckbox");
                if (0 === f.length) return !1;
                c.status
                    ? (f.find("input:checkbox").prop("checked", !1), f.first().find("input:checkbox").prop("checked", !0), f.find("input:checkbox").length > 1 && this.showResetText(this.$$.find(".js-stp"), c.status))
                    : (f.find("input:checkbox").prop("checked", !0), this.showResetText(this.$$.find(".js-stp"), c.status)),
                    this.changeFilterCountAndAnimateReset();
            },
            onPriceSlideStart: function (a, b) {
                var c = a.detail.ui.handle == e(b).find(".ui-slider-handle:first")[0] ? "min" : "max";
                this.updateFareGraph(e(b), a.detail.ui.values, c), this.addGraphAnimation(a, b);
            },
            sliderStop: function (a, b) {
                e(b).closest(".sliderMeter").removeClass("css-active-slider"),
                    e(b).closest(".filterContain").find(".css-fl-departure-time-graph").hide().find("div:first").css("height", "0px"),
                    e(b).closest(".css-sliders-cont").removeClass("css-slider-active-cont");
            },
            onTimeSlideStart: function (a, b) {
                var c = a.detail.ui.handle == e(b).find(".ui-slider-handle:first")[0] ? "min" : "max";
                this.updateTimeGraph(e(b), a.detail.ui.values, c), this.addGraphAnimation(a, b);
            },
            addGraphAnimation: function (a, b) {
                e(b).closest(".sliderMeter").addClass("css-active-slider"),
                    e(b).closest(".filterContain").find(".css-fl-departure-time-graph").show().find("div:first").animate({ height: "97px" }, 50),
                    e(b).closest(".css-sliders-cont").addClass("css-slider-active-cont");
            },
            onPriceSliderChange: function (a, b) {
                var c = e(b).val().split(","),
                    f = e(b).closest(".commonFilters"),
                    g = f.find("jq-slider"),
                    h = "";
                f.find(".css-fl-low-price-rate").html(d.format.amount(c[0])),
                    f.find(".css-fl-highest-price-rate").html(d.format.amount(c[1])),
                    this.prevMin != c[0] ? (h = "min") : this.prevMax != c[1] && (h = "max"),
                    this.updateFareGraph(g, c, h);
                var i = g.attr("min") != c[0] || g.attr("max") != c[1];
                (this.prevMin = c[0]), (this.prevMax = c[1]), this.showResetText(b, i), this.updateFilter("pr", c, this.searchIndex), this.publish_change();
            },
            updateFilter: function (a, b, c) {
                this.fSearch.updateFilter(a, b, c), this.setFiltersToQuery(a, c);
            },
            updateFareGraph: function (a, b, c) {
                var d = a.attr("max") - a.attr("min"),
                    e = 170 / d;
                (leftMinPx = e * (b[0] - a.attr("min"))), (leftMaxPx = e * (b[1] - a.attr("min")));
                var f = Math.ceil(leftMinPx / 5),
                    g = Math.ceil(leftMaxPx / 5);
                "min" === c ? this.$$.find(".js-price-slid-selector").css("left", leftMinPx + "px") : "max" === c && this.$$.find(".js-price-slid-selector").css("left", leftMaxPx + "px"),
                    ($graph = this.$$.find(".js-price-dots-graph div")),
                    0 === f && 0 === g
                        ? $graph.not(".js-empty-div").find("span").removeClass().addClass("css-disable")
                        : ($graph
                              .filter(":lt(" + f + "):not(.js-empty-div)")
                              .find("span")
                              .removeClass()
                              .addClass("css-disable"),
                          $graph
                              .filter(":gt(" + (g < 34 ? g - 2 : g - 1) + "):not(.js-empty-div)")
                              .find("span")
                              .removeClass()
                              .addClass("css-disable"),
                          $graph
                              .slice(f, g < 34 ? g - 1 : g)
                              .not(".js-empty-div")
                              .find("span")
                              .removeClass()
                              .addClass("css-enable"));
            },
            updateTimeGraph: function (a, b, c) {
                var d,
                    e,
                    f = a.attr("max") - a.attr("min"),
                    g = 170 / f;
                (leftMinPx = g * (b[0] - a.attr("min"))), (leftMaxPx = g * (b[1] - a.attr("min")));
                var h = Math.ceil(leftMinPx / 5),
                    i = Math.ceil(leftMaxPx / 5);
                "departureTime" == a.attr("id") ? ((d = ".js-dep-time-slid-selector"), (e = ".js-dep-time-graph")) : ((d = ".js-arr-time-slid-selector"), (e = ".js-arr-time-graph")),
                    "min" === c ? this.$$.find(d).css("left", leftMinPx + "px") : "max" === c && this.$$.find(d).css("left", leftMaxPx + "px"),
                    ($graph = this.$$.find(e + " div")),
                    0 === h && 0 === i
                        ? $graph.not(".js-empty-div").find("span").removeClass().addClass("css-disable")
                        : ($graph
                              .filter(":lt(" + h + "):not(.js-empty-div)")
                              .find("span")
                              .removeClass()
                              .addClass("css-disable"),
                          $graph
                              .filter(":gt(" + (i < 34 ? i - 1 : i) + "):not(.js-empty-div)")
                              .find("span")
                              .removeClass()
                              .addClass("css-disable"),
                          $graph
                              .slice(h, i < 34 ? i : i + 1)
                              .not(".js-empty-div")
                              .find("span")
                              .removeClass()
                              .addClass("css-enable"));
            },
            onTimeSliderChange: function (a, b) {
                var c,
                    d = e(b).val().split(","),
                    f = e(b).closest(".commonFilters"),
                    g = f.find("jq-slider");
                (c = moment(g.data("base")).startOf("day").add(d[0], "minute").format("HH:mm, ddd")),
                    f.find(".slider-pri-input").val(c),
                    (c = moment(g.data("base")).startOf("day").add(d[1], "minute").format("HH:mm, ddd")),
                    f.find(".slider-sec-input").val(c),
                    "departureTime" == e(b).attr("id")
                        ? (this.updateFilter("dep_dt", d, this.searchIndex), this.prevDepMin !== d[0] ? (handle = "min") : this.prevDepMax !== d[1] && (handle = "max"), (this.prevDepMin = d[0]), (this.prevDepMax = d[1]))
                        : (this.updateFilter("ar_dt", d, this.searchIndex), this.prevArrMin !== d[0] ? (handle = "min") : this.prevArrMax !== d[1] && (handle = "max"), (this.prevArrMin = d[0]), (this.prevArrMax = d[1]));
                var h = g.attr("min") != d[0] || g.attr("max") != d[1];
                this.updateTimeGraph(g, d, handle), this.showResetText(b, h), this.publish_change();
            },
            onDurationSliderChange: function (a, b) {
                var c = e(b).val().split(","),
                    d = e(b).closest(".commonFilters"),
                    f = d.find("jq-slider");
                d.find(".slider-pri-input").val(c[0] + " hrs"),
                    d.find(".slider-sec-input").val(c[1] + " hrs"),
                    "maxDuration" == e(b).attr("id") ? this.updateFilter("tt", c, this.searchIndex) : this.updateFilter("lott", c, this.searchIndex);
                var g = f.attr("min") != c[0] || f.attr("max") != c[1];
                this.showResetText(b, g), this.publish_change();
            },
            onFilterSelect: function (a, b) {
                var c = "",
                    d = [],
                    f = 0,
                    g = 0,
                    h = -1,
                    i = e(b).closest(".filterContain").find("input:checkbox");
                i.each(function () {
                    (c = e(this).attr("id").split("_")), e(this).prop("checked") ? (d.push(c[1]), f++) : g++;
                }),
                    (h = "fares" == c[0] || "fq" == c[0] ? (g == i.length ? 0 : 1) : f == i.length ? 0 : 1),
                    this.updateFilter(c[0], d, this.searchIndex),
                    this.showResetText(b, h),
                    this.publish_change(),
                    "stp" === c[0] && this.checkNonStopFilterState();
            },
            showMultiAirline: function (a, b) {
                e(b).prop("checked") ? this.updateFilter("multi_al", 1, this.searchIndex) : this.updateFilter("multi_al", 0, this.searchIndex), this.publish_change();
            },
            onFilterOnlyClick: function (a, b) {
                var c = e(b).siblings("input").attr("id").split("_"),
                    d = [],
                    f = 0;
                if ("ap" != c[0]) e(b).closest(".filterContain").find("input").prop("checked", !1), e(b).siblings("input").prop("checked", !0), (d = [c[1]]);
                else {
                    "fr" == c.slice(-1) ? e(b).closest(".filterContain").find("[id$='_fr']").prop("checked", !1) : e(b).closest(".filterContain").find("[id$='_to']").prop("checked", !1), e(b).siblings("input").prop("checked", !0);
                    e(b)
                        .closest(".filterContain")
                        .find("input:checkbox")
                        .each(function () {
                            (c = e(this).attr("id").split("_")), e(this).prop("checked") && d.push(c[1]), f++;
                        });
                }
                if ("al" == c[0]) {
                    var g = this.$$.find("#al_multiple");
                    this.updateFilter("multi_al", g.prop("checked") ? 1 : 0, this.searchIndex);
                }
                this.updateFilter(c[0], d, this.searchIndex), "ap" == c[0] && f == d.length ? this.showResetText(b, 0) : this.showResetText(b, 1), this.publish_change();
            },
            showResetText: function (a, b) {
                var c = "";
                if (e(a).hasClass("js-reset")) return void e(a).hide();
                (c = e(a).hasClass("commonFilters") ? e(a).find(".js-reset") : e(a).closest(".filterContain").siblings(".filterHd").find(".js-reset")), b ? c.show() : c.hide();
            },
            resetFilter: function (a, b) {
                var c = e(b).closest(".commonFilters").attr("class"),
                    f = c.split("-"),
                    g = "";
                if (
                    ("dt" == f[1] && (f[1] = "dep_dt"),
                    "at" == f[1] && (f[1] = "ar_dt"),
                    this.fSearch.resetFilter(f[1], this.searchIndex),
                    this.setFiltersToQuery(f[1], this.searchIndex),
                    "al" == f[1] || "stp" == f[1] || "ap" == f[1] || "loap" == f[1] || "eq" == f[1])
                )
                    e(b).closest(".commonFilters").find("input:checkbox").prop("checked", !0);
                else if ("fq" == f[1] || "fares" == f[1]) e(b).closest(".commonFilters").find("input:checkbox").prop("checked", !1);
                else {
                    var h = e(b).closest(".commonFilters"),
                        i = h.find("jq-slider");
                    i.val(i.attr("min") + "," + i.attr("max")),
                        "pr" == f[1]
                            ? (h.find(".css-fl-low-price-rate").html(d.format.amount(i.attr("min"))), h.find(".css-fl-highest-price-rate").html(d.format.amount(i.attr("max"))))
                            : "dep_dt" == f[1] || "ar_dt" == f[1]
                            ? ((g = moment(i.data("base")).startOf("day").add(i.attr("min"), "minute").format("HH:mm, ddd")),
                              h.find(".slider-pri-input").val(g),
                              (g = moment(i.data("base")).startOf("day").add(i.attr("max"), "minute").format("HH:mm, ddd")),
                              h.find(".slider-sec-input").val(g))
                            : (h.find(".slider-pri-input").val(i.attr("min") + " hrs"), h.find(".slider-sec-input").val(i.attr("max") + " hrs"));
                }
                return "al" == f[1] && this.showMultiAirline("", this.$$.find("#al_multiple")), this.showResetText(b, 0), this.publish_change(), "stp" === f[1] && this.checkNonStopFilterState(), preventPropagation(a);
            },
            resetMouseOver: function (a, b) {
                e(b).removeClass().addClass();
            },
            convertTimeToInt: function (a) {
                var b = a.split(":");
                return 60 * parseInt(b[0]) + parseInt(b[1]);
            },
            convertApproxTimetoInt: function (a, b, c) {
                var d = "",
                    e = 0;
                return (d = moment(a).diff(moment(b).startOf("day"), "minute")), (e += "ciel" == c ? 60 * Math.ceil(parseInt(d) / 60) : "floor" == c ? 60 * Math.floor(parseInt(d) / 60) : parseInt(d));
            },
            getTimeInColonFormat: function (a) {
                var b = Math.floor(a / 60),
                    c = a - 60 * b;
                return 1 == b.toString().length && (b = "0" + b), 1 == c.toString().length && (c = "0" + c), 0 === c && (c = "00"), b + ":" + c;
            },
            showOnlyKeyword: function (a, b) {
                e(b).find(".only").show();
            },
            hideOnlyKeyword: function (a, b) {
                e(b).find(".only").hide();
            },
            doBindings: function () {
                var a = this;
                a.changeFilterCount(),
                    a.$$.find(".aerlineCheckbox.maxDuration").closest(".filterContain").css("display", "none").siblings(".filterHd").removeClass("active"),
                    a.$$.find(".js-ap .filterContain, .js-loap .filterContain, .js-lott .filterContain, .js-fq .filterContain,  .js-eq .filterContain").hide().siblings(".filterHd").removeClass("active"),
                    a.$$.find(".js-more-than-5").hide(),
                    a.$$.find(".js-reset").hide();
                var b = a.$$.find(".commonFilters"),
                    c = -1;
                b.each(function () {
                    var b = [];
                    if (e(this).find("jq-slider").length > 0) {
                        var d = e(this).find("jq-slider");
                        (b = d.attr("value").split(",")), (c = d.attr("min") != b[0] || d.attr("max") != b[1]);
                    } else if (e(this).find("input:checkbox").length > 0) {
                        var f = e(this).find("input:checkbox"),
                            g = 0,
                            h = 0;
                        f.each(function () {
                            (id = e(this).attr("id").split("_")), e(this).prop("checked") ? g++ : h++;
                        }),
                            (c = "fares" == id[0] || "fq" == id[0] ? (h == f.length ? 0 : 1) : g == f.length ? 0 : 1);
                    }
                    a.showResetText(this, c);
                }),
                    a.$$.find(".css-ellipsis").each(function () {
                        d.addTooltipForEllipsis(this);
                    });
            },
            publish_change: window.debounce(function () {
                var a = this;
                this.pipe.publish("flights.filter.change", { searchIndex: this.searchIndex, from: "filter" }), a.changeFilterCountAndAnimateReset();
            }, 100),
            setFiltersToQuery: function (a, b) {
                var c = this,
                    d = c.router.getQueryParam("filters") || [];
                "clear" == a
                    ? (d = [])
                    : "clearByIndex" == a && void 0 !== b
                    ? (d[b] = [])
                    : a &&
                      a.match(/^al|ar_dt|dep_dt|pr|stp|loap|tt|lott|fq|ap|eq|fares$/) &&
                      ((d[b] = d[b] || {}),
                      "I" != c.flightType || is.Empty(c.fSearch.intlModFilters[b]) ? is.Empty(c.filters[b].modFilterData) || (d[b][a] = c.filters[b].modFilterData[a].value) : (d[b][a] = c.fSearch.intlModFilters[b][a].value),
                      /^al|stp|loap|fq|ap$/.test(a) && is.Empty(d[b][a]) && (d[b][a] = [""])),
                    c.router.setQueryParam("filters", d),
                    c.saveSearch();
            },
            saveSearch: debounce(function () {
                var a = this,
                    b = a.router.getQueryParams(),
                    d = is.Array(b.depart) ? b.depart[0] : b.depart;
                (b.adult = Number(b.adult)), (b.child = Number(b.child)), (b.infant = Number(b.infant));
                var e = { product: "flight", data: { start_date: moment(d, "DD-MM-YYYY").format("DD-MM-YYYY"), query: JSON.stringify(b) } };
                c.setRecentSearches(e);
            }, 1e3),
            changeFilterCountAndAnimateReset: function () {
                var a = this,
                    b = a.$$.find(".js-reset");
                a.changeFilterCount(),
                    0 === a.fSearch.getFilteredResultsCount() ? (a.$$.find(".js-reset").addClass("css-red"), b.animate({ fontSize: "13px" }, 500), b.animate({ fontSize: "11px" }, 500)) : a.$$.find(".js-reset").removeClass("css-red");
            },
            changeFilterCount: function () {
                var a = 0,
                    b = 0;
                if ("I" == this.flightType || "S" == this.searchType)
                    1 === this.rescheduling
                        ? ((a = 1 * this.filters[this.searchIndex].getFilteredResultsCount()), (b = 1 * this.filters[this.searchIndex].getResultsCount()))
                        : ((a = 1 * this.filters[0].getFilteredResultsCount()), (b = 1 * this.filters[0].getResultsCount()));
                else for (var c = this.totalLegs - 1; c >= 0; c--) (a += 1 * this.filters[c].getFilteredResultsCount()), (b += 1 * this.filters[c].getResultsCount());
                var d = a + " <i>of</i> " + b;
                this.$$.find(".flightFilter").find("i").html(d);
            },
            toggleAllAirline: function (a, b) {
                e(b).siblings(".js-more-than-5").slideToggle(300);
                var c = e(b).find("span");
                "Show All" == e(b).find("span").text() ? c.text("Hide") : c.text("Show All");
            },
            openPayamentGatewayDD: function (a, b) {
                (a.PAYMENTGATEWAYDD = !0), e(b).find(".js-payment-gateway-dd").slideToggle();
            },
            selectPaymentGateway: function (a, b, c) {
                var d = this;
                if ((d.$$.find(".js-payment-gateway-text").text(e(b).text()), "I" != d.flightType))
                    for (var f = d.totalLegs - 1; f >= 0; f--)
                        ("R" === d.searchType && 2 === f) ||
                            (d.filters[f].updateConvFee(c.pgType, 1 * c.pgValue), d.filters[f].updateFilter("pg", e(b).text(), d.searchIndex, !0), d.pipe.publish("flights.filter.change", { searchIndex: f, from: "filter" }), d.render());
                else d.fSearch.updateConvFee(c.pgType, 1 * c.pgValue), d.updateFilter("pg", e(b).text(), d.searchIndex, !0), d.pipe.publish("flights.filter.change", { searchIndex: d.searchIndex, from: "filter" }), d.render();
            },
            changeListTimelineView: function (a, b, c) {
                var d = this;
                d.router.setQueryParam("view", c.type), d.render(), d.pipe.publish("flights.filter.change", { searchIndex: d.searchIndex, from: "filter", viewChange: !0, action: "renderAll" });
            },
            documentClick: function (a, b, c) {
                is.Empty(c) || c.PAYMENTGATEWAYDD || this.$$.find(".js-payment-gateway-dd").slideUp("fast");
            },
            updateCorporateFare: function (a) {
                var b = this;
                if ("S" == b.searchType || "I" == this.flightType) b.filters[0].updateSICT("true" == a), b.publish_change(0);
                else for (var c = 0; c < b.totalLegs; c++) b.filters[c].updateSICT("true" == a), b.pipe.publish("flights.filter.change", { searchIndex: c, from: "filter" });
            },
            _remove_: function () {
                this.pipe.off(), this.router.off();
            },
        };
    }),
    define({
        name: "at.flights.header",
        extend: "spamjs.view.extended",
        modules: ["jqrouter", "rivets", "moment", "jQuery", "jqbus", "at.flightservice", "jsutils.cache", "at.common.functions", "at.login", "spamjs.modal", "at.formatter"],
    }).as(function (a, b, c, d, e, f, g, h, i, j, k) {
        (c.formatters.formatDateShort = function (a) {
            return (a || [])
                .split(" - ")
                .map(function (a) {
                    return d(a, "DD-MM-YYYY").format("D MMM");
                })
                .join(" - ");
        }),
            (c.formatters.formatDate = function (a) {
                return d(a, "ddd, DD MMM YY").format("D MMM YYYY");
            }),
            (c.formatters.buttonText = function (a) {
                return 1 == a ? "Modify Search" : "Search Flight";
            }),
            (c.formatters.addYearsToDate = function (a) {
                return "today" == a ? d().add(2, "years").format("DD-MM-YYYY") : d(a, "YYYY-MM-DD").add(2, "years").format("DD-MM-YYYY");
            }),
            (c.formatters.formatUcwords = function (a) {
                return a ? a.ucwords() : a;
            }),
            (c.formatters.isEmpty = function (a) {
                return is.Empty(a);
            });
        var l = h.instance("recentAirportsCache"),
            m = "origin",
            n = "destination",
            o = "depart",
            p = "return",
            q = "ddd, DD MMM YY";
        return {
            routerEvents: {
                "?destination=": "searchFlights2",
                "?origin=": "searchFlights2",
                "?depart=": "searchFlights2",
                "?return=": "searchFlights2",
                "?adult=": "searchFlights2",
                "?child=": "searchFlights2",
                "?infant=": "searchFlights2",
                "?reload=": "searchFlights2",
            },
            globalEvents: { document_click: "documentClick" },
            events: {
                "click .js-flights-search": "searchFlights",
                "click #clearReturningDate": "clearReturnDate",
                "click .ui-flightCountBox": "passengerBoxClick",
                "click .js-pax-count": "openPassengerCountWidget",
                "click .plus": "addPassenger",
                "click .minus": "removePassenger",
                "click .js-nearest-airport": "nearestAirportSearch",
                "click .js-nearest-airport-dd li": "selectNearestAirport",
                "click .js-icons-interchange": "interchangeLocations",
                "click .flightClass": "openCabinClassWidget",
                "click .recentSearches": "openRecentSearchesWidget",
                "click .js-cabin-class li": "selectCabinClass",
                "click .js-trip-type-nav > a": "changeTripType",
                "click .js-add-flight": "addNewFlight",
                "click .js-remove-flight": "removeAddedFlights",
                "jq.focus.in .js-airport-search": "openRecentAirportsWidget",
                "focusout .js-airport-search": "focusOutAirportSearch",
                "jq.query .js-airport-search": "searchAirports",
                "jq.init .js-airport-search": "initializeAirportSearchWidget",
                "jq.shortcut .js-airport-search": "checkAirport",
                click: "headerClicked",
                "keyup .js-pax-count-box input": "changePaxCountByKey",
                "change #js-non-stop-header-flag": "changeSearchStatus",
                "focusin jq-autocomplete.multi-flights-origin": "autoPopulateOrigin",
                "focusin #js-return-date": "changePlaceHodlerToReturn",
                "focusout #js-return-date": "changePlaceHodlerToOneWay",
                "click .js-collapsed-sector-name, .js-total-pax-view": "expandHeader",
                "click .js-location-icon": "getCurrentLocation",
                "date.selected": "dateChange",
                "jq.autocomplete.oncreate": "renderAirportSearch",
                "click .js-bulk-book": "bookBulkFlights",
                "click .js-date-options > a": "changeDateOption",
                "click .js-preferred-flight": "openPrefferedFlightDD",
                "click .js-special-request": "openSpecialRequestDD",
                "modal.closed": "onModalClose",
                "click .js-recent-search-item": "onRecentSearchItemClick",
                "click .js-calendar-icon": "focusElement",
            },
            _init_: function () {
                var a = this;
                (a.pipe = f.instance()),
                    (a.router = b.instance(this)),
                    a.pipe.bind(a),
                    (a.multicityObj = { origin: "", destination: "", departingDate: "", startDate: "today" }),
                    (a.multiSearchFlag = 0),
                    (a.multicityArr = [JSON.parse(JSON.stringify(a.multicityObj))]),
                    a.loadWithScroll({ src: "at.flights.header.html", data: {} }).done(function () {
                        a.doBindings();
                    });
            },
            formatRecentSearch: function (a) {
                for (var b in a) {
                    var c = a[b].query,
                        d = "",
                        f = "",
                        g = "",
                        h = "";
                    if (
                        ((h = c.adult + " adult" + (c.adult > 1 ? "s" : "")),
                        (h += c.child > 0 ? ", " + c.child + " child" + (c.child > 1 ? "ren" : "") : ""),
                        (h += c.infant > 0 ? ", " + c.infant + " infant" + (c.infant > 1 ? "s" : "") : ""),
                        "single" == c.trip_type)
                    )
                        (d = c[m] + " → " + c[n]), (f = c[o]);
                    else if ("return" == c.trip_type) (d = c[m] + " ⇌ " + c[n]), (f = c[o] + " - " + c[p]);
                    else {
                        var i = this.checkDisconnectedAirports(c[m], c[n]);
                        i.flag ? (d = c[m][0] + " → " + c[n].join(" → ")) : ((g = i.title), (d = c[m][0] + " → ... → " + c[n].slice(-1))), (f = c[o].join(" - "));
                    }
                    a[b] = { name: d, date: f, timeAgo: a[b].time_ago, query: "?" + e.param(c), title: g, paxStr: h };
                }
                return a;
            },
            checkDisconnectedAirports: function (a, b) {
                for (var c = !0, d = a[0] + " → " + b[0], e = 1; e < a.length; e++) a[e] !== b[e - 1] ? ((c = !1), (d += ", " + a[e] + " → " + b[e])) : (d += " → " + b[e]);
                return { title: d, flag: c };
            },
            renderAirportSearch: function (a) {
                e(a.detail.event.target).catcomplete("instance")._renderItemData = function (a, b) {
                    var c = b.label;
                    if (void 0 !== this.term)
                        try {
                            return (
                                (c = c.replace(new RegExp(this.term, "gi"), function (a) {
                                    return "<strong>" + a + "</strong>";
                                })),
                                (c = c.split("~")),
                                (c = '<span class="css-airport-name-box  css-ellipsis">' + c[0] + '</span><span class="css-three-code-box">' + c[1] + "</span>"),
                                $("<li></li>").data("ui-autocomplete-item", b).append(c).appendTo(a)
                            );
                        } catch (a) {
                            return !0;
                        }
                };
            },
            searchFlights2: debounce(function (a) {
                var b,
                    c = this;
                e(".modal").modal("hide"),
                    c.setModelFromQueryParams().done(function () {
                        (b = c.generateSearchCriteria()), "single" === b.trip_type && c.$$.find("#js-return-date").attr("placeholder", "One way").addClass("css-dark-placeholder"), c.saveSearchAndPublish(b, a);
                    });
            }, 100),
            saveSearchAndPublish: debounce(function (a, b) {
                var c = this;
                is.Empty(a) ||
                    (c.saveSearch(a),
                    e.when.apply(e, c.airportSearches).done(function () {
                        c.publishSearchQuery(a, b), (c.airportSearches = []);
                    }));
            }, 100),
            saveSearch: debounce(function (a) {
                var b = is.Array(a[o]) ? a[o][0] : a[o],
                    c = { product: "flight", data: { start_date: d(b, "DD-MM-YYYY").format("DD-MM-YYYY"), query: JSON.stringify(a) } };
                g.setRecentSearches(c);
            }),
            addRecentAirports: function (a, b) {
                var c = l.get("recentAirportsCache") || {},
                    d = {},
                    e = Object.keys(c);
                (c[a] = b),
                    e.filter(function (b) {
                        return b.value !== a;
                    }),
                    e.unshift(a),
                    e.splice(10, e.length);
                for (var f = 0; f < e.length; f++) d[e[f]] = c[e[f]];
                try {
                    l.set("recentAirportsCache", d);
                } catch (a) {}
            },
            initializeRivetsModel: function () {
                var a = this;
                a.model({
                    returningDate: "",
                    adult: 1,
                    child: 0,
                    infant: 0,
                    tripType: "R",
                    origin: "",
                    departingDate: "",
                    destination: "",
                    cabinClass: "Economy",
                    nonStopFlag: !1,
                    journeys: a.multicityArr,
                    searchedLegs: [],
                    totalPassenger: "1 Adult",
                    searchStatus: 0,
                    flightSearchs: "",
                    bulkBooking: !1,
                    bulkBookingMsg: !1,
                    dateOption: "Flex",
                }),
                    j.isCorporate() && (a.model().corpCodeFlag = !0);
            },
            setModelFromRecentSearch: debounce(function () {
                var a,
                    b,
                    c = this,
                    e = {};
                g.getRecentSearches({ product: "flight" }).done(function (f) {
                    f.success &&
                        ((e = is.Empty(f.data.search[0]) ? {} : f.data.search[0].query),
                        is.Empty(e) ||
                            ((c.model().origin = is.Array(e.origin) ? e.origin[0] : e.origin),
                            (c.model().destination = is.Array(e.destination) ? e.destination[0] : e.destination),
                            (a = is.Array(e.depart) ? e.depart[0] : e.depart),
                            (b = is.Empty(e.return) ? "" : e.return),
                            (c.model().adult = parseInt(e.adult) || 1),
                            (c.model().child = parseInt(e.child) || 0),
                            (c.model().infant = parseInt(e.infant) || 0),
                            c.calculateTotalPassCount()),
                        is.Empty(c.model().origin) &&
                            g.getIATAFromIP().done(function (a) {
                                a.success && (c.model().origin = a.data.airports[0]);
                            }),
                        (b = d(b, "DD-MM-YYYY")),
                        (a = d(a, "DD-MM-YYYY")),
                        (c.model().returningDate = b.isValid() ? b.format("ddd, DD MMM YY") : ""),
                        (c.model().departingDate = a.isValid() && a.isAfter(d(), "days") ? a.format("ddd, DD MMM YY") : d().format("ddd, DD MMM YY")));
                });
            }, 500),
            setModelFromQueryParams: function () {
                var a = this,
                    c = b.getQueryParams(),
                    f = e.Deferred();
                if (
                    ("true" === c.nonStopFlag || !0 === c.nonStopFlag ? (a.model().nonStopFlag = !0) : (a.model().nonStopFlag = !1),
                    j.isCorporate() && ("true" === c.corpCodeFlag || !0 === c.corpCodeFlag ? (a.model().corpCodeFlag = !0) : (a.model().corpCodeFlag = !1)),
                    (a.model().returningDate = is.Empty(c.return) ? "" : d(c.return, "DD-MM-YYYY").format("ddd, DD MMM YY")),
                    (a.model().adult = 1 * c.adult),
                    (a.model().child = 1 * c.child),
                    (a.model().infant = 1 * c.infant),
                    is.Empty(c.cabinclass) ||
                    c.cabinclass
                        .toLowerCase()
                        .trim()
                        .match(/^economy$|^premium economy$|^business$|^first$/g)
                        ? (a.model().cabinClass = c.cabinclass || "Economy")
                        : (a.model().cabinClass = "Economy"),
                    "multi" == c.trip_type)
                ) {
                    (a.model().tripType = "M"), (a.multicityArr = [JSON.parse(JSON.stringify(a.multicityObj))]), a.addNewFlight(), a.addNewFlight(), (a.model().journeys = a.multicityArr);
                    for (var g = 0; g < 5; g++)
                        is.Empty(c.origin[g]) ||
                            (is.Empty(a.model().journeys[g]) && a.model().journeys.push(JSON.parse(JSON.stringify(a.multicityObj))),
                            (a.model().journeys[g].origin = c.origin[g].toUpperCase()),
                            (a.model().journeys[g].destination = c[n][g].toUpperCase()),
                            (a.model().journeys[g].departingDate = is.Empty(c.depart[g]) ? "" : d(c.depart[g], "DD-MM-YYYY").format("ddd, DD MMM YY")));
                    a.resetMulticityModel(), (a.model().searchStatus = 1), f.resolve();
                } else
                    (a.model().tripType = "R"),
                        (a.model().origin = ""),
                        (a.model().destination = ""),
                        setTimeout(function () {
                            (a.model().origin = c.origin), (a.model().destination = c.destination), f.resolve();
                        }),
                        (a.model().departingDate = is.Empty(c.depart) ? "" : d(c.depart, "DD-MM-YYYY").format("ddd, DD MMM YY")),
                        (a.model().searchStatus = 0);
                return a.calculateTotalPassCount(), f.promise();
            },
            resetMulticityModel: function () {
                var a = JSON.parse(JSON.stringify(this.multicityArr));
                this.multicityArr.splice(0, this.multicityArr.length);
                for (var b = 0; b < a.length; b++)
                    0 === b ? (a[b].startDate = "today") : is.Empty(a[b - 1].departingDate) ? (a[b].startDate = a[b - 1].startDate) : (a[b].startDate = d(a[b - 1].departingDate, "ddd, DD MMM YY").format("YYYY-MM-DD")),
                        this.multicityArr.push(a[b]);
            },
            removeAddedFlights: function (a, b, c) {
                this.multicityArr.length > 2 && (this.multicityArr.splice(c.index, 1), this.resetMulticityModel()),
                    2 == this.multicityArr.length ? this.$$.find(".js-remove-flight").addClass("css-no-hover") : this.$$.find(".js-remove-flight").removeClass("css-no-hover"),
                    this.multicityArr.length < 5 && this.$$.find(".js-add-flight").removeClass("css-disable-color");
            },
            addNewFlight: function (a, b) {
                this.multicityArr.length < 5 && (this.multicityArr.push(JSON.parse(JSON.stringify(this.multicityObj))), this.resetMulticityModel()),
                    5 == this.multicityArr.length && e(b).addClass("css-disable-color"),
                    this.$$.find(".js-remove-flight").removeClass("css-no-hover");
            },
            changeTripType: function (a, c, d) {
                if (((this.model().searchStatus = 0), "Regular" == (is.Empty(d) ? e(c).text() : "multi-city" == d ? "Multi-City" : "Regular"))) {
                    if (!is.Empty(a) && (a.ctrlKey || a.metaKey)) return window.open("/flights?TT=regular#/search"), preventPropagation(a);
                    b.setQueryParam("TT", "regular"), (this.model().tripType = "R");
                } else {
                    if (!is.Empty(a) && (a.ctrlKey || a.metaKey)) return window.open("/flights?TT=multi-city#/search"), preventPropagation(a);
                    b.setQueryParam("TT", "multi-city"),
                        is.Empty(this.model().journeys[0].origin) &&
                            is.Empty(this.model().journeys[0].destination) &&
                            is.Empty(this.model().journeys[0].departingDate) &&
                            ((this.model().journeys[0].origin = void 0 !== this.model().origin ? this.model().origin.split(",")[0] : ""),
                            (this.model().journeys[0].destination = void 0 !== this.model().destination ? this.model().destination.split(",")[0] : ""),
                            (this.model().journeys[0].departingDate = this.model().departingDate),
                            (this.model().journeys[0].startDate = "today")),
                        (this.model().tripType = "M"),
                        this.resetMulticityModel();
                }
                return this.$$.find(".flights--tooltip").tooltip({ placement: "bottom" }), preventPropagation(a);
            },
            generateSearchCriteria: function (a) {
                var b = this,
                    c = {};
                if (b.validateSearchCriteria() || a) {
                    a || b.model().bulkBooking || this.$$.find(".js-flights-search").addClass("loading");
                    for (var d in b.model())
                        if (!d.match(/journeys|searchedLegs|totalPassenger|searchStatus|flightSearchs|noRecentSearches|paxError|paxWarning|bulkBooking|dateOption/)) {
                            var e = "";
                            switch (d) {
                                case "departingDate":
                                    e = "depart";
                                    break;
                                case "tripType":
                                    e = "trip_type";
                                    break;
                                case "returningDate":
                                    e = "return";
                                    break;
                                case "cabinClass":
                                    e = "cabinclass";
                                    break;
                                default:
                                    e = d;
                            }
                            "tripType" == d
                                ? "R" == b.model()[d] && is.Empty(b.model().returningDate)
                                    ? ((c[e] = "single"), (c.totalLegs = 1))
                                    : "R" != b.model()[d] || is.Empty(b.model().returningDate)
                                    ? "M" == b.model()[d] && (c[e] = "multi")
                                    : ((c[e] = "return"), (c.totalLegs = 2))
                                : "departingDate" == d
                                ? (c.depart = b.formatDate(b.model().departingDate))
                                : "returningDate" == d
                                ? (c.return = b.formatDate(b.model().returningDate))
                                : (c[e] = b.model()[d]);
                        }
                    if ("M" == b.model().tripType) {
                        (c.origin = []), (c[n] = []), (c.depart = []), (b.model().searchedLegs = []);
                        var f = [];
                        for (var d in b.model().journeys)
                            is.Object(b.model().journeys[d]) &&
                                -1 === f.indexOf(b.model().journeys[d]._rv) &&
                                (f.push(b.model().journeys[d]._rv),
                                is.Empty(b.model().journeys[d].origin) ||
                                    is.Empty(b.model().journeys[d].destination) ||
                                    is.Empty(b.model().journeys[d].departingDate) ||
                                    ((c.origin[d] = b.model().journeys[d].origin),
                                    (c[n][d] = b.model().journeys[d].destination),
                                    (c.depart[d] = b.formatDate(b.model().journeys[d].departingDate)),
                                    (b.multiSearchFlag = 1),
                                    b.model().searchedLegs.push(JSON.parse(JSON.stringify(b.model().journeys[d])))));
                        (c.totalLegs = b.model().searchedLegs.length), (b.model().searchStatus = 1);
                    }
                } else b.model().searchStatus = 0;
                return c;
            },
            formatDate: function (a) {
                return is.Empty(a) ? "" : d(a, "ddd, DD MMM YY").format("DD-MM-YYYY");
            },
            publishSearchQuery: debounce(function (a, b) {
                var c = this,
                    e = c.formatRecentSearch([{ query: a }])[0].name,
                    f = is.Array(a[o])
                        ? a[o].map(function (a) {
                              return d(a, "DD-MM-YYYY").format("D MMM");
                          })
                        : d(a[o], "DD-MM-YYYY").format("D MMM") + ("return" == a.trip_type ? " - " + d(a[p], "DD-MM-YYYY").format("D MMM") : "");
                this.pipe.publish("flights.search.query", { searchCriteria: a, sectorName: e, sectorDate: f, partial: "depart" == b || "return" == b });
            }, 200),
            searchFlights: function (a) {
                var c = this;
                return a.ctrlKey || a.metaKey
                    ? (window.open("/flights?" + e.param(c.generateSearchCriteria(!0)), "_blank"), preventPropagation(a))
                    : 1 == c.model().searchStatus && "URL" != a && "M" == c.model().tripType
                    ? void (c.model().searchStatus = 0)
                    : void e.when.apply(e, c.airportSearches).done(function () {
                          var a = c.generateSearchCriteria();
                          is.Empty(a) || (is.Empty(b.getQueryParam("PF")) || (a.PF = b.getQueryParam("PF")), is.Empty(c.flightNumber) || (a["flight-number"] = c.flightNumber), b.go("#/searched", a));
                      });
            },
            setPinnedFlightsToQuery: function (a) {
                b.setQueryParam("PF", a);
            },
            validateSearchCriteria: function () {
                var a = this;
                if ((a.$$.find(".error").removeClass("error"), a.$$.find(".css-error-msgs").text(""), "R" == a.model().tripType)) a.validateRegularTrip();
                else {
                    for (var b in a.model().journeys)
                        is.Object(a.model().journeys[b]) &&
                            (b < 2
                                ? a.validateMulticityTrip(b)
                                : (is.Empty(a.model().journeys[b].destination) && is.Empty(a.model().journeys[b].origin) && is.Empty(a.model().journeys[b].departingDate)) || !(b > 1) || a.validateMulticityTrip(b));
                }
                return is.Empty(this.model().totalPassenger) && (($input = a.$$.find(".js-pax-count")), $input.addClass("error").next().text("Please select no. of passengers")), !a.$$.find(".error").length;
            },
            validateMulticityTrip: function (a) {
                var b,
                    c = this;
                is.Empty(c.model().journeys[a].origin) && ((b = c.$$.find("jq-autocomplete.multi-flights-origin").eq(a).closest(".tag.textInput")), b.addClass("error").next().text("Please enter valid origin")),
                    is.Empty(c.model().journeys[a].destination) && ((b = c.$$.find("jq-autocomplete.multi-flights-destination").eq(a).closest(".tag.textInput")), b.addClass("error").next().text("Please enter valid destination")),
                    is.Empty(c.model().journeys[a].departingDate.trim())
                        ? ((b = c.$$.find(".multi-flights-depart-date").eq(a).closest(".tag.textInput")), b.addClass("error").next().text("Please enter valid date"))
                        : a > 0 &&
                          ((b = c.$$.find(".multi-flights-depart-date").eq(a).closest(".tag.textInput")),
                          d(c.model().journeys[a].departingDate, q).isBefore(d(c.model().journeys[a - 1].departingDate, q), "day") && b.addClass("error").next().text("Please enter dates one after the other")),
                    d().isAfter(d(c.model().journeys[a].departingDate, q), "day") && ((b = c.$$.find(".multi-flights-depart-date").eq(a).closest(".tag.textInput")), b.addClass("error").next().text("Please enter valid date")),
                    c.model().journeys[a].origin == c.model().journeys[a].destination &&
                        "" != c.model().journeys[a].origin &&
                        ((b = c.$$.find("jq-autocomplete.multi-flights-destination").eq(a).closest(".tag.textInput")), b.addClass("error").next().text("Origin and destination cannot be same"));
            },
            validateRegularTrip: function () {
                var a,
                    b = this;
                is.Empty(b.model().origin) && ((a = b.$$.find("#js-flights-origin").closest(".tag.textInput")), a.addClass("error").next().text("Please enter valid origin")),
                    is.Empty(b.model().destination) && ((a = b.$$.find("#js-flights-dest").closest(".tag.textInput")), a.addClass("error").next().text("Please enter valid destination"));
                var c = d(b.model().departingDate, q),
                    e = d(b.model().returningDate, q);
                is.Empty(b.model().departingDate.trim()) || d().isAfter(c, "day")
                    ? ((a = b.$$.find("#js-depart-date").closest(".tag.textInput")), a.addClass("error").next().text("Please enter valid departure date"))
                    : d().add(1, "y").isBefore(c) && ((a = b.$$.find("#js-depart-date").closest(".tag.textInput")), a.addClass("error").next().text("Select date upto 1 year from today")),
                    !is.Empty(b.model().returningDate.trim()) && d().add(1, "y").isBefore(e) && ((a = b.$$.find("#js-return-date").closest(".tag.textInput")), a.addClass("error").next().text("Select date upto 1 year from today")),
                    !is.Empty(b.model().returningDate.trim()) &&
                        c.isAfter(e, "day") &&
                        ((a = b.$$.find("#js-depart-date").closest(".tag.textInput")),
                        b.$$.find("#js-return-date").closest(".tag.textInput").addClass("error"),
                        a.addClass("error").next().text("Departure date must be prior to return date"));
                for (var f = is.Empty(b.model().origin) ? "" : b.model().origin.split(","), g = 0, h = 0; h < f.length; h++)
                    if (b.model().destination.indexOf(f[h]) > -1) {
                        g = 1;
                        break;
                    }
                ((b.model().origin == b.model().destination && "" !== b.model().origin) || g) && ((a = b.$$.find("#js-flights-dest").closest(".tag.textInput")), a.addClass("error").next().text("Origin and destination cannot be same"));
            },
            clearReturnDate: function () {
                (this.model().returningDate = ""), this.$$.find("#js-return-date").focus();
            },
            changePlaceHodlerToReturn: function () {
                this.$$.find("#js-return-date").attr("placeholder", "Returning").removeClass("css-dark-placeholder");
            },
            changePlaceHodlerToOneWay: function () {
                "single" === b.getQueryParam("trip_type") && this.$$.find("#js-return-date").attr("placeholder", "One way").addClass("css-dark-placeholder");
            },
            passengerBoxClick: function (a) {
                a.PASSENGERBOXCLICK = !0;
            },
            openPassengerCountWidget: function (a) {
                "none" == this.$$.find(".ui-flightCountBox").css("display") ? this.$$.find(".ui-flightCountBox").show("fast") : a.PASSENGERBOXCLICK || this.$$.find(".ui-flightCountBox").slideUp("fast"), (a.PASSENGERBOXCLICK = !0);
            },
            addPassenger: function (a, b) {
                (this.model().paxError = ""),
                    (this.model().paxWarning = ""),
                    e(b).hasClass("adults")
                        ? this.model().adult++
                        : e(b).hasClass("children")
                        ? this.model().child++
                        : e(b).hasClass("infants") && (this.model().infant < this.model().adult ? this.model().infant++ : (this.model().paxError = "Infants should not exceed adults")),
                    this.calculateTotalPassCount();
            },
            removePassenger: function (a, b) {
                (this.model().paxError = ""),
                    (this.model().paxWarning = ""),
                    e(b).hasClass("adults") && (this.model().adult > 1 && this.model().adult--, this.model().adult > 0 && this.model().adult == this.model().infant - 1 && this.model().infant--),
                    e(b).hasClass("children") && this.model().child > 0 && this.model().child--,
                    e(b).hasClass("infants") && this.model().infant > 0 && this.model().infant--,
                    this.calculateTotalPassCount();
            },
            changePaxCountByKey: function (a, b) {
                (this.model().adult =
                    is.Empty(this.model().adult) || this.model().adult < 1
                        ? 1
                        : 1 *
                          this.model()
                              .adult.toString()
                              .replace(/[^0-9]/g, "")),
                    (this.model().child = is.Empty(this.model().child)
                        ? 0
                        : 1 *
                          this.model()
                              .child.toString()
                              .replace(/[^0-9]/g, "")),
                    (this.model().infant = is.Empty(this.model().infant)
                        ? 0
                        : 1 *
                          this.model()
                              .infant.toString()
                              .replace(/[^0-9]/g, "")),
                    (this.model().paxError = ""),
                    (this.model().paxWarning = ""),
                    38 == a.keyCode
                        ? this.addPassenger(a, b)
                        : 40 == a.keyCode
                        ? this.removePassenger(a, b)
                        : a.keyCode > 47 &&
                          a.keyCode < 58 &&
                          (e(b).hasClass("infants") || e(b).hasClass("adults")) &&
                          this.model().infant > this.model().adult &&
                          ((this.model().infant = this.model().adult), (this.model().paxError = "Infants should not exceed adults")),
                    this.calculateTotalPassCount();
            },
            nearestAirportSearch: debounce(function (a, b) {
                var c = "",
                    d = this,
                    f = "",
                    h = e(b).closest(".icon-right"),
                    i = e(b).closest(".icon-right").siblings("jq-autocomplete").find(".icon-right"),
                    j = e(b).closest("div").siblings(".js-nearest-airport-dd");
                e(b).closest("div").siblings("#js-flights-origin").length > 0 ? (c = this.model().origin) : e(b).closest("div").siblings("#js-flights-dest").length > 0 && (c = this.model().destination),
                    (f = c.split(",")),
                    (f[0] = f[0].replace(/(.)*\(/, "").replace(")", "")),
                    is.Empty(c) ||
                        (i.show(),
                        h.hide(),
                        g
                            .getNearestAirports({ iata_code: c })
                            .done(function (a) {
                                var b = a.data,
                                    c = "";
                                i.hide(), h.show(), (c = "<ul>");
                                for (var g in b) {
                                    (c += '<li data-iata="' + b[g].iata + '">'), f.indexOf(b[g].iata) > -1 ? (c += '<i class="icon icon_checkmark"></i>') : (c += '<i class="">&nbsp;</i>');
                                    var k = is.Empty(b[g].distance)
                                        ? ""
                                        : Math.min.apply(
                                              this,
                                              b[g].distance.map(function (a) {
                                                  return parseInt(a.distance);
                                              })
                                          ) + " km";
                                    c += '<span class="css-airport-name-box  css-ellipsis">' + b[g].city + ", " + b[g].country_code + " - " + b[g].airport + " (" + b[g].iata + ')</span> <i class="css-kms"> ' + k + "</i></li>";
                                }
                                (c += "<li class='js-nearest-airport-error css-more-location-error' style='display:none'><i>&nbsp;</i></li></ul>"), e(j).html(c).data("type", "nearest").slideDown(), d.perfectScrollbar(j).init();
                            })
                            .fail(function () {
                                i.hide(), h.show();
                            }));
            }, 300),
            openRecentAirportsWidget: function (a, b, c) {
                var d = e(b).siblings(".js-nearest-airport-dd"),
                    f = l.get("recentAirportsCache"),
                    g = [],
                    h = 0;
                if (!is.Empty(f)) {
                    var i = "<ul>";
                    if ((this.$$.find(".js-nearest-airport-dd").not(d).slideUp(), !is.Empty(a.detail.display))) return void ("by-airline" != d.data("type") ? e(d).slideUp() : this.searchAirports(a, b, c));
                    a.detail.setValue(""), (i += '<li style="font-weight:bold;" class="recent-airport-heading">Recently searched airports</li>');
                    for (var j in f)
                        if (
                            ((i += '<li data-iata="' + f[j].iata + '">'),
                            (i += '<span class="css-airport-name-box  css-ellipsis">' + f[j].city + ", " + f[j].country_code + " - " + f[j].airport + '</span><span class="css-three-code-box">' + f[j].iata + "</span></li>"),
                            g.push(f[j].iata),
                            g.length > 5)
                        )
                            break;
                    is.Empty(this.popularAirports) || (i += '<li style="font-weight:bold;" class="recent-airport-heading">Popular airports</li>');
                    for (var j in this.popularAirports)
                        if (
                            !(g.indexOf(this.popularAirports[j].iata) > -1) &&
                            ((i += '<li data-iata="' + this.popularAirports[j].iata + '">'),
                            (i +=
                                '<span class="css-airport-name-box  css-ellipsis">' +
                                this.popularAirports[j].city +
                                ", " +
                                this.popularAirports[j].country_code +
                                " - " +
                                this.popularAirports[j].airport +
                                '</span><span class="css-three-code-box">' +
                                this.popularAirports[j].iata +
                                "</span></li>"),
                            ++h > 5)
                        )
                            break;
                    (i += "<li class='js-nearest-airport-error css-more-location-error' style='display:none'></li></ul>"), d.html(i).data("type", "recent").slideDown(), this.perfectScrollbar(d).init();
                }
            },
            openAirportSearchByAirline: function (a, b, c) {
                var d = e(b).siblings(".js-nearest-airport-dd"),
                    f = c.airports,
                    g = "<ul>",
                    h = !1;
                if (is.Empty(f) || !e(b).find("input").is(":focus"))
                    d.slideUp("fast", function () {
                        h || e(this).html("");
                    });
                else {
                    (h = !0), this.$$.find(".js-nearest-airport-dd").not(d).hide();
                    for (var i in f)
                        (g += '<li class="' + (f[i].type, "css-sub-category") + '" data-iata="' + f[i].origin + "," + f[i].destination + '">'),
                            (g += f[i].ocity + " (" + f[i].origin + ") → " + f[i].dcity + " (" + f[i].destination + ")</li>");
                    (g += "<li class='js-nearest-airport-error css-more-location-error' style='display:none'></li></ul>"), d.html(g).data("type", "by-airline").slideDown(), this.perfectScrollbar(d).init();
                }
            },
            focusOutAirportSearch: function (a, b, c) {
                var d = e(b).closest("jq-autocomplete").siblings(".js-nearest-airport-dd"),
                    f = d.siblings(".js-airport-search").find("input").val();
                /\d/.test(f) && (this.flightNumber = f), this.closeRecentAirportsWidget(a, b, c), this.closeAirportSearchByAirline(a, b, c);
            },
            closeRecentAirportsWidget: debounce(function (a, b) {
                var c = e(b).closest("jq-autocomplete").siblings(".js-nearest-airport-dd");
                "recent" == c.data("type") && c.slideUp();
            }, 200),
            closeAirportSearchByAirline: debounce(function (a, b) {
                var c = e(b).closest("jq-autocomplete").siblings(".js-nearest-airport-dd");
                "by-airline" == c.data("type") &&
                    (2 == c.find("li").length && this.setRoutesAsPerFlightNumber(c.find("li:first").data("iata")),
                    c.slideUp(function () {
                        e(this).html("");
                    }));
            }, 100),
            selectNearestAirport: function (a, b) {
                var c,
                    d = e(b).closest(".js-nearest-airport-dd");
                if (!is.Empty(e(b).data("iata"))) {
                    if ((d.siblings("#js-flights-origin").length > 0 ? (c = "origin") : d.siblings("#js-flights-dest").length > 0 && (c = "destination"), "recent" === d.data("type")))
                        return (this.model()[c] = e(b).data("iata")), (this.flightNumber = ""), void d.slideUp();
                    if ("by-airline" == d.data("type")) return this.setRoutesAsPerFlightNumber(e(b).data("iata")), void d.slideUp();
                    var f = this.model()[c].split(","),
                        g = e(b).find("i:first");
                    g.hasClass("icon_checkmark")
                        ? 1 === f.length
                            ? e(b).siblings(".js-nearest-airport-error").html("<i>&nbsp;</i>Minimum 1 location is required").show().delay(1e3).fadeOut()
                            : ((f = f.filter(function (a) {
                                  return a !== e(b).data("iata");
                              })),
                              g.removeClass().html("&nbsp"),
                              (this.model()[c] = f.join(",")))
                        : 3 === f.length
                        ? e(b).siblings(".js-nearest-airport-error").html("<i>&nbsp;</i>Cannot add more than 3 locations").show().delay(1e3).fadeOut()
                        : (f.push(e(b).data("iata")), (this.model()[c] = f.join(",")), g.addClass("icon icon_checkmark").html("")),
                        (a.NEARESTAIRPORTSELECT = !0);
                }
            },
            setRoutesAsPerFlightNumber: function (a) {
                var b = a.split(",");
                (this.model().origin = ""), (this.model().origin = b[0]), (this.model().destination = ""), (this.model().destination = b[1]);
            },
            interchangeLocations: debounce(function (a, b, c) {
                var d;
                void 0 !== c.index
                    ? is.Empty(this.model().journeys[c.index].origin) ||
                      is.Empty(this.model().journeys[c.index].destination) ||
                      ((d = this.model().journeys[c.index].origin), (this.model().journeys[c.index].origin = this.model().journeys[c.index].destination), (this.model().journeys[c.index].destination = d), e(b).toggleClass("rotate"))
                    : is.Empty(this.model().origin) || is.Empty(this.model().destination) || ((d = this.model().origin), (this.model().origin = this.model().destination), (this.model().destination = d), e(b).toggleClass("rotate"));
            }),
            openRecentSearchesWidget: function (a, b) {
                var c = this,
                    d = e(b).next(),
                    f = d.find(".js-loader");
                if (d.is(":visible")) return void d.slideUp("fast");
                d.slideDown("fast"),
                    f.show(),
                    g
                        .getRecentSearches({ product: "flight" })
                        .done(function (a) {
                            f.hide(),
                                (c.model().noRecentSearches = is.Empty(a.data.search)),
                                a.success ? ((c.model().flightSearchs = c.formatRecentSearch(a.data.search)), d.find(".flights--tooltip").tooltip({ placement: "bottom" }), c.perfectScrollbar(d).init()) : d.slideUp("fast");
                        })
                        .fail(function () {
                            f.hide(), (c.model().noRecentSearches = !0), d.slideUp("fast");
                        }),
                    (a.RECENTSEARCHBOXCLICK = !0);
            },
            openCabinClassWidget: function (a) {
                1 == this.model().searchStatus && (this.model().searchStatus = 0),
                    "none" == this.$$.find(".js-cabin-class").css("display") ? this.$$.find(".js-cabin-class").slideDown("fast") : this.$$.find(".js-cabin-class").slideUp("fast"),
                    (a.CABINCLASSBOXCLICK = !0);
            },
            openPrefferedFlightDD: function (a, b) {
                e(b).next(".class-grade-drop").slideToggle("fast").find("input").focus(), (a.PREFERREDFLIGHTBOXCLICK = !0);
            },
            openSpecialRequestDD: function (a, b) {
                e(b).next(".class-grade-drop").slideToggle("fast").find("input").focus(), (a.SPECIALREQUESTBOXCLICK = !0);
            },
            selectCabinClass: function (a, b) {
                var c = e(b)
                    .text()
                    .match(/.*?(?=\(|\/)/i);
                (c = null !== c ? c[0] : e(b).text()), (c = c.trim()), this.$$.find(".flightClass").text(c), (this.model().cabinClass = c);
            },
            changeSearchStatus: function (a, b) {
                this.pipe.publish("headers.non.stop.filter.change", { status: e(b).is(":checked") });
            },
            expandHeader: function () {
                this.model().searchStatus = 0;
            },
            doBindings: function () {
                var a = this,
                    c = b.getQueryParams();
                if ((a.addNewFlight(), a.addNewFlight(), a.$$.find(".flights--tooltip").tooltip({ placement: "bottom" }), a.setRivetsModel(), c.hasOwnProperty("origin"))) return void a.searchFlights2();
                c.hasOwnProperty("TT") && a.changeTripType("", "", b.getQueryParam("TT")),
                    c.hasOwnProperty("nonStopFlag") && (a.model().nonStopFlag = "true" == c.nonStopFlag),
                    a.setModelFromRecentSearch(),
                    g.searchAirports({ popular_airports: 1 }).done(function (b) {
                        b.success && (a.popularAirports = b.data);
                    });
            },
            setRivetsModel: function () {
                var a = b.getQueryParams(),
                    c = this;
                if ((c.initializeRivetsModel(), is.Empty(a))) return void c.setModelFromRecentSearch();
            },
            calculateTotalPassCount: function () {
                var a = "";
                this.checkBulkBookingCriteria(),
                    this.model().adult > 0 && (this.model().child > 0 || this.model().infant > 0)
                        ? (a = this.model().adult + this.model().child + this.model().infant + " Passengers")
                        : this.model().adult > 0 && (a = this.model().adult + (1 == this.model().adult ? " Adult" : " Adults")),
                    (this.model().totalPassenger = a),
                    1 * this.model().adult + 1 * this.model().child >= 6 && (this.model().paxWarning = "Certain airlines do not allow booking of more than 6 seats at once"),
                    this.$$.find(".ui-flightCountBox").siblings("input").val(a);
            },
            checkBulkBookingCriteria: function () {
                this.model().child + this.model().adult > 9 ? (this.model().bulkBooking = !0) : (this.model().bulkBooking = !1);
            },
            getAirports: function (a) {
                var b = this,
                    c = h.instance("airports"),
                    d = e.Deferred();
                return (
                    (a = a.toUpperCase()),
                    c.has(a)
                        ? (b.searchAirportsService && /\d/.test(a) && b.searchAirportsService.abort(), d.resolve(c.get(a)))
                        : (b.searchAirportsService = g.searchAirports({ q: a }).done(function (b) {
                              if (b.success)
                                  try {
                                      c.set(a, b);
                                  } catch (a) {}
                              d.resolve(b);
                          })),
                    d.promise()
                );
            },
            searchAirports: function (a, b, c) {
                var d = this,
                    f = a.detail.display,
                    g = a.detail.display.split(","),
                    h = e(b).closest(".tag.textInput"),
                    i = !is.Empty(e(b).attr("multiple"));
                h.next().text(""),
                    h.removeClass("error"),
                    (g[0] = g[0].replace(/(.)*\(/, "").replace(")", "")),
                    (displaystr = g.slice(0, -1).join(",")),
                    "" === f ? d.openRecentAirportsWidget(a, b, c) : d.closeRecentAirportsWidget(a, b, c),
                    a.detail.term.length < 2 && e(b).find(".ui-menu").hide(),
                    g.length <= 3
                        ? a.detail.term.length >= 2 &&
                          d.getAirports(a.detail.term).done(function (f) {
                              if (f.success) {
                                  var g = f.data.results,
                                      h = [];
                                  if ("airports" == f.data.type) {
                                      for (var j in g)
                                          (h[j] = {}),
                                              (h[j].text = g[j].city + ", " + g[j].country_code + " - " + g[j].airport + "~" + g[j].iata),
                                              (h[j].id = "" !== displaystr && i ? displaystr + "," + g[j].iata : g[j].iata),
                                              (h[j].category = g[j].category);
                                      a.detail.callback(h), d.closeAirportSearchByAirline(a, b, c), (d.flightNumber = "");
                                  } else
                                      e(b).find("input").is(":focus") ? (e(".ui-autocomplete").hide(), d.openAirportSearchByAirline(a, b, { airports: g })) : (e(".ui-autocomplete").hide(), d.autoFillAirportByAirline(a, b, f.data.results));
                              }
                          })
                        : (a.detail.setDisplay(a.detail.value), a.detail.setError("Location cannot be more than 3"));
            },
            initializeAirportSearchWidget: function (a, b, c) {
                var d = this,
                    f = a.detail.value.toUpperCase().replace(" ", "").split(","),
                    g = !is.Empty(e(b).attr("multiple"));
                if (f.length > 1 && a.detail.value.match(/[a-z]+/)) return void d.checkAirport(a, b, c);
                if (f.length > 3 && g) return a.detail.setDisplay(f.join(",")), void a.detail.setError("Location cannot be more than 3");
                if (("" === f[0] || f.length > 1) && g) return a.detail.setValue(f.unique().join(",")), void a.detail.setDisplay(f.unique().join(","));
                if (a.detail.value.length >= 2) {
                    var h = [{}],
                        i = d.getAirports(a.detail.value).done(function (b) {
                            var c = b.data;
                            "airports" == c.type &&
                                ((c = c.results),
                                (c = c.filter(function (b) {
                                    return a.detail.value.indexOf(b.iata) > -1;
                                })),
                                c.length > 0 &&
                                    (d.addRecentAirports(c[0].iata, c[0]),
                                    (h[0].text = c[0].city + ", " + c[0].country_code + " - " + c[0].airport + " (" + c[0].iata + ")"),
                                    (h[0].display = c[0].city + " (" + c[0].iata + ")"),
                                    (h[0].id = c[0].iata),
                                    a.detail.callback(h)));
                        });
                    is.Empty(d.airportSearches) && (d.airportSearches = []), d.airportSearches.push(i);
                }
                is.Empty(this.model().origin) || d.$$.find("#js-flights-origin").find(".icon-right").is(":visible")
                    ? d.$$.find("#js-flights-origin").siblings(".icon-right").hide()
                    : d.$$.find("#js-flights-origin").siblings(".icon-right").show(),
                    is.Empty(this.model().destination) || d.$$.find("#js-flights-dest").find(".icon-right").is(":visible")
                        ? d.$$.find("#js-flights-dest").siblings(".icon-right").hide()
                        : d.$$.find("#js-flights-dest").siblings(".icon-right").show();
            },
            autoFillAirportByAirline: function (a, b, c) {
                var d = e(b).closest(".tag.textInput"),
                    f = d.attr("class").indexOf("origin") ? "origin" : "destination";
                1 == (c || []).length ? this.setRoutesAsPerFlightNumber([c[0].origin, c[0].destination].join(",")) : (this.model()[f] = "");
            },
            checkAirport: function (a, b) {
                var c,
                    d = this,
                    f = e(b).closest(".tag.textInput"),
                    h = a.detail.display.replace(/(.)*\(/, "").replace(")", ""),
                    i = {};
                if (is.Empty(a.detail.display.match(/\d/))) {
                    if (!is.Empty(h)) {
                        if (([{}], (i = { airports: h, flag: is.Empty(e(b).attr("multiple")) ? "s" : "m" }), "," == h)) return f.next().text("Invalid IATA code ,"), f.addClass("error"), void f.children(".icon-right").hide();
                        var c = g.checkAirportsIATA(i).done(function (b) {
                            if (is.Empty(b.errors.invalid_airports)) {
                                var c = b.data.airports.join(",");
                                a.detail.setValue(c.replace(/(.)*\(/, "").replace(")", ""), c), f.next().text(""), f.removeClass("error"), f.children(".icon-right").show();
                            } else f.next().text("Invalid IATA code " + b.errors.invalid_airports), f.addClass("error"), f.children(".icon-right").hide();
                        });
                        is.Empty(d.airportSearches) && (d.airportSearches = []), d.airportSearches.push(c);
                    }
                } else
                    d.getAirports(a.detail.display).done(function (c) {
                        if (c.success && "airlines" == c.data.type) {
                            f.attr("class").indexOf("origin");
                            d.autoFillAirportByAirline(a, b, c.data.results);
                        }
                    });
            },
            autoPopulateOrigin: function (a, b, c) {
                c.index > 0 && (this.model().journeys[c.index].origin = this.model().journeys[c.index - 1].destination);
            },
            documentClick: function (a, b, c) {
                void 0 !== c &&
                    (c.PASSENGERBOXCLICK || 0 !== e(c.target).closest(".ui-flightCountBox").length || this.$$.find(".ui-flightCountBox").slideUp("fast"),
                    c.CABINCLASSBOXCLICK || this.$$.find(".js-cabin-class").slideUp("fast"),
                    c.PREFERREDFLIGHTBOXCLICK || 0 !== e(c.target).closest(".class-grade-drop").prev(".js-preferred-flight").length || this.$$.find(".js-preferred-flight").next().slideUp("fast"),
                    c.SPECIALREQUESTBOXCLICK || 0 !== e(c.target).closest(".class-grade-drop").prev(".js-special-request").length || this.$$.find(".js-special-request").next().slideUp("fast"),
                    c.RECENTSEARCHBOXCLICK || ((this.model().noRecentSearches = !1), this.$$.find(".recent-searches-drop").slideUp("fast")),
                    c.FLIGHTSHEADERCLICK || 1 != this.multiSearchFlag || 0 !== e(c.target).closest(".ui-autocomplete").length || (this.model().searchStatus = 1),
                    c.NEARESTAIRPORTSELECT || 0 !== e(c.target).closest(".js-nearest-airport-dd").length || e(c.target).hasClass("js-airport-search") || this.$$.find(".js-nearest-airport-dd").slideUp());
            },
            headerClicked: function (a) {
                a.FLIGHTSHEADERCLICK = !0;
            },
            isConnectedAirports: function (a, b) {
                for (var c = 1; c < a.length; c++) if (a[c] !== b[c - 1]) return !1;
                return !0;
            },
            getCurrentLocation: function (a, b, c) {
                var d = this;
                g.getIATAFromIP().done(function (a) {
                    a.success && ("R" == d.model().tripType ? (d.model().origin = a.data.airports[0]) : "M" == d.model().tripType && (d.model().journeys[c.index].origin = a.data.airports[0]));
                });
            },
            dateChange: function (a) {
                var b = this,
                    c = a.detail.target,
                    f = c.find(".textInput"),
                    g = 1 * c.attr("data-datepickerid");
                if ((f.next().text(""), f.removeClass("error"), 2 == c.find("input").length))
                    return void (
                        d().isBefore(a.detail.selectedDate, "day") &&
                        c.find("input").each(function () {
                            e(this).closest(".textInput").removeClass("error").next().html("");
                        })
                    );
                if (b.$$.find("[data-datepickerid=" + (g + 1) + "]").length > 0) {
                    b.$$.find("[data-datepickerid=" + (g + 1) + "]");
                    this.multicityArr[g + 1].startDate = a.detail.selectedDate;
                    for (var h = g + 1; h < this.multicityArr.length; h++) {
                        var i = "";
                        (i = is.Empty(this.multicityArr[h].departingDate) ? d(this.multicityArr[h - 1].startDate, "YYYY-MM-DD") : d(this.multicityArr[h].departingDate)),
                            i.isBefore(d(a.detail.selectedDate, "YYYY-MM-DD")) && (this.multicityArr[h].departingDate = "");
                    }
                    var j = c.closest(".js-multi-city"),
                        k = j.find("input:focus").parent(),
                        l = k.attr("data-index");
                    this.resetMulticityModel(), k.hasClass("js-airport-search") ? this.focusOnNextDate(j.find(".js-airport-search[data-index=" + l + "]")) : this.focusOnNextDate(b.$$.find("[data-datepickerid=" + (g + 1) + "]"));
                }
            },
            focusOnNextDate: debounce(function (a) {
                a.find("input").focus();
            }, 100),
            changeDateOption: function (a, b) {
                return "Fixed" == e(b).text() ? (this.model().dateOption = "Fix") : (this.model().dateOption = "Flex"), preventPropagation(a);
            },
            bookBulkFlights: function (a, b) {
                var c = this;
                if (j.isLoggedIn()) {
                    var f = this.generateSearchCriteria();
                    if (!is.Empty(f)) {
                        var h = f.depart;
                        f.return;
                        h = is.Array(h)
                            ? h.map(function (a) {
                                  return d(a, "DD-MM-YYYY").format("YYYY-MM-DD");
                              })
                            : d(h, "DD-MM-YYYY").format("YYYY-MM-DD");
                        var l = {
                            source: f.origin,
                            destination: f.destination,
                            from_date: h,
                            to_date: is.Empty(f.return) ? "" : d(f.return, "DD-MM-YYYY").format("YYYY-MM-DD"),
                            adt: f.adult,
                            chd: f.child,
                            inf: f.infant,
                            preferred: this.$$.find(".js-preferred-flight-number").val(),
                            special_request: this.$$.find(".js-special-request-text").val(),
                            trip_type: f.trip_type,
                            cabin_class: f.cabinclass,
                            dates_fixed: "Flex" == this.model().dateOption ? 0 : 1,
                            direct_flight_only: this.model().nonStopFlag ? 1 : 0,
                        };
                        e(b).prop("disabled", !0).addClass("loading"),
                            g
                                .bulkBook(l)
                                .done(function (a) {
                                    e(b).prop("disabled", !1).removeClass("loading"),
                                        a.success
                                            ? ((c.model().bulkBookingMsg = !0),
                                              setTimeout(function () {
                                                  (c.model().bulkBookingMsg = !1), (c.model().bulkBooking = !1), (c.model().adult = 1), (c.model().child = 0), (c.model().infant = 0), c.calculateTotalPassCount();
                                              }, 2e3))
                                            : i.alert.show(i.getErrorMsg("flights", a.errors, "bulkBooking"), "error");
                                })
                                .fail(function () {
                                    i.alert.show("Unable to process your request, Please try again", "error");
                                });
                    }
                } else
                    this.$$.parent(".searchBarMain").addClass("css-no-index"),
                        k.confirm(this, { title: "Please sign in to send a bulk booking request", buttonLabel: "Sign In" }).done(function (a) {
                            a && c.router.go("#/login");
                        });
            },
            onModalClose: function () {
                this.$$.parent(".searchBarMain").removeClass("css-no-index");
            },
            onRecentSearchItemClick: function (a) {
                is.Empty(a) || (!a.ctrlKey && !a.metaKey) || (a.RECENTSEARCHBOXCLICK = !0);
            },
            focusElement: function (a, b) {
                e(b).prev().focus();
            },
            _remove_: function () {
                this.pipe.off(), this.router.off();
            },
        };
    }),
    _define_({ name: "at.flights.booking.confirmation", extend: "spamjs.view", modules: ["jQuery"] }).as(function (a, b) {
        return {
            events: { "click .js-continue-to-book": "continueToBook", "click .js-change-flight": "changeFlight" },
            _init_: function () {
                var a,
                    b = this;
                (a = b.options.data.isCombo ? "at.flights.intl.booking.confirmation.html" : "at.flights.booking.confirmation.html"), this.view({ src: a, data: b.options.data.resp.data.itinerary });
            },
            continueToBook: function (a, c) {
                var d = this;
                b(c).addClass("loading").prop("disabled", !0),
                    "function" == typeof d.options.callback && (d.options.callback({ type: "continue", itineraryData: d.options.data.resp, dataObj: d.options.data.dataObj }), b(c).removeClass("loading").prop("disabled", !1));
            },
            changeFlight: function () {
                var a = this;
                "function" == typeof a.options.callback && a.options.callback.apply(a.options.calleeObj, [{ type: "change", itineraryData: a.options.data.resp.data }]);
            },
            _remove_: function () {},
        };
    }),
    _define_({ name: "at.flights.branded.fare", extend: "spamjs.view.extended", modules: ["moment", "jqbus", "at.flightservice", "jQuery", "at.common.functions", "jsutils.cache"] }).as(function (a, b, c, d, e, f, g) {
        var h = g.instance("brandedFare");
        return {
            events: { "click .js-close": "close", "click .js-book": "book", "click .js-select": "selectClass", "click .js-arrow": "slideDiv" },
            _init_: function () {
                var a = this;
                (a.pipe = c.instance()),
                    a.pipe.bind(this),
                    (a.totalLegs = a.options.data.selected.length),
                    (a.selectedFares = a.options.data.selected.map(function (a) {
                        return { fare: a.farepr, fk: a.fk };
                    })),
                    (a.brandedFareCalls = []),
                    a.load({ src: "at.flights.branded.fare.html", data: a.options.data }).done(function () {
                        a.$$.find(".js-left-arrow").hide(), a.renderTemplate(), a.$$.find(".flights-tooltip").tooltip({ placement: "bottom" });
                    });
            },
            close: function () {
                var a = this;
                "function" == typeof a.options.callback && a.options.callback.apply(a.options.parent);
            },
            renderTemplate: function () {
                var a = this;
                a.options.data.isIntlReturn
                    ? a.fetchBrandedFaresAtOnce()
                    : (_.map(a.options.data.fk, function (b, c) {
                          a.options.data.selected[c].otherfares && a.brandedFareCalls.push(a.fetchBrandedFaresOneByOne(b, c));
                      }),
                      e.when.apply(e, a.brandedFareCalls).done(function () {
                          a.changeTotalFare(), a.$$.find(".js-book").prop("disabled", !1).removeClass("disabled");
                      }));
            },
            fetchBrandedFaresOneByOne: function (a, b) {
                var c = this;
                return c.getBrandedFares({ sid: c.options.data.sid, fk: [a], old_farepr: [c.options.data.oldFare[b]] }).done(function (a) {
                    if (a.success) {
                        var d = !0;
                        a.data.change_results && c.updateChangedResults(a),
                            (c.details = c.details || []),
                            (c.details[b] = a.data.other_fares[0]),
                            is.Empty(c.details[b])
                                ? c.$$.find("#leg-head-" + b)
                                      .attr("disabled", !0)
                                      .addClass("css-disabled")
                                : (c.renderDetails(b, c.details[b]), d && (c.$$.find("jq-tab").attr("value", "leg-" + b), (d = !1)));
                    } else c.appendNoFareImage(b);
                });
            },
            fetchBrandedFaresAtOnce: function () {
                var a = this;
                a.getBrandedFares({ sid: a.options.data.sid, fk: a.options.data.fk, old_farepr: a.options.data.oldFare }).done(function (b) {
                    if (b.success) {
                        var c = !0;
                        b.data.change_results && a.updateChangedResults(b), (a.details = b.data.other_fares);
                        for (var d = 0; d < a.totalLegs; d++) is.Empty(a.details[d]) ? a.$$.find("#leg-head-" + d).attr("disabled", !0) : (a.renderDetails(d, a.details[d]), c && (a.$$.find("jq-tab").attr("value", "leg-" + d), (c = !1)));
                        a.changeTotalFare(), a.$$.find(".js-book").prop("disabled", !1).removeClass("disabled");
                    } else for (var e = 0; e < a.totalLegs; e++) a.appendNoFareImage(e);
                });
            },
            updateChangedResults: function (a) {
                var b = this;
                Object.values(a.data.change_results).map(function (a) {
                    b.selectedFares = b.selectedFares.map(function (c) {
                        return c.fk == a.fk ? ((c.fare = a.farepr), (c.highlight = !0)) : b.options.data.isIntlReturn && b.options.data.fk == a.fk && ((c.fare = a.farepr), (c.highlight = !0)), c;
                    });
                }),
                    b.options.$results.fareConfirmationBoxClose({ detail: { data: { resp: a, target: b.options.data.target } } });
            },
            appendNoFareImage: function (a) {
                var b = e("<img/>")
                    .attr("src", CONTEXT_PATH + "resources/assets/scss/skin/img/common/no-branded-fare.png")
                    .width("960px");
                this.$$.find("#leg-pane-" + a)
                    .html(b)
                    .append('<div class="css-error-massege">No other fares found for this itinerary</div>');
            },
            renderDetails: function (a, b) {
                var c = this;
                c.loadWithScroll({ src: "at.flights.branded.fare.details.html", selector: "#leg-pane-" + a, data: b }).done(function () {
                    c.changeFares(a),
                        c.$$.find(".js-scrollable-div").scroll(function () {
                            $(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight ? $(this).addClass("css-hide-gradient") : $(this).hasClass("css-hide-gradient") && $(this).removeClass("css-hide-gradient");
                        });
                });
            },
            changeFares: function (a, b) {
                var c = 0,
                    d = this.details[a],
                    g = "",
                    h = this.$$.find("#leg-pane-" + a + " .js-select"),
                    i = this.$$.find("#leg-pane-" + a + " .js-amount");
                h.addClass("line").removeClass("fill").text("Select");
                for (var j in d) (d[j].index = j), void 0 !== b ? (d[j].selected = j == b) : d[j].default ? ((d[j].selected = !0), (d[j].highlight = this.selectedFares[a].highlight || !1)) : (d[j].selected = !1);
                for (var k in d) {
                    if ((d[k].highlight && ((d[k].highlight = !1), h.eq(d[k].index).parent().siblings(".js-amount").effect("highlight", {}, 2e3)), d[k].selected)) {
                        (this.selectedFares[a].fk = d[k].fk), (c = this.selectedFares[a].fare), (g = f.format.amount(c)), h.eq(d[k].index).addClass("fill").removeClass("line").text("Selected");
                        var l = this.$$.find(".js-selected-class-" + a);
                        this.setClass(l, d[k]);
                    } else (c = d[k].farepr - this.selectedFares[a].fare), (g = f.format.amount(c)), c >= 0 && (g = e(f.format.amount(c)).prepend("+ "));
                    i.eq(d[k].index).html(g);
                }
            },
            setClass: function (a, b) {
                var c = this;
                if (is.String(b.class)) {
                    var d = c.formatBookingClass(c.getClassWithBookingClass(b.class, b.bc));
                    a.html(d), a.closest("jq-popover").find(".js-sub-class").html(d);
                } else if (is.Array(b.class))
                    for (var e in b.class) {
                        this.options.data.isIntlReturn && (a = this.$$.find(".js-leg-class").eq(e));
                        var f = a.closest("jq-popover").find(".js-sub-class"),
                            d = c.formatBookingClass(c.getClassWithBookingClass(b.class[e], b.bc[e]));
                        a.html(d),
                            b.class[e].map(function (a, d) {
                                if (a) var g = c.formatBookingClass(c.getClassWithBookingClass(a, b.bc[e][d]));
                                f.eq(d).html(g);
                            });
                    }
            },
            selectClass: function (a, b, c) {
                var d = this.$$.find("jq-tab").attr("value").split("-")[1];
                (this.selectedFares[d] = { fk: this.details[d][c.index].fk, fare: this.details[d][c.index].farepr }), this.changeFares(d, c.index), this.changeTotalFare();
            },
            changeTotalFare: function () {
                var a = 0;
                if (this.options.data.isIntlReturn) a = this.selectedFares[0].fare;
                else for (var b in this.selectedFares) a += this.selectedFares[b].fare;
                return this.$$.find(".js-total-amount").html(f.format.amount(a)), a;
            },
            book: function (a, b) {
                var c = this,
                    d = _.pluck(c.selectedFares, "fk"),
                    f = _.pluck(c.selectedFares, "fare"),
                    g = {
                        fk: c.options.data.isIntlReturn
                            ? [d[0]]
                            : d.filter(function (a) {
                                  return !is.Empty(a);
                              }),
                        old_farepr: c.options.data.isIntlReturn
                            ? [f[0]]
                            : f.filter(function (a) {
                                  return !is.Empty(a);
                              }),
                        sid: c.options.data.sid,
                    };
                c.options.data.isIntlReturn && (g.combo = !0),
                    is.Empty(this.selectedFares) ||
                        (e(b).addClass("loading").prop("disabled", !0),
                        "function" == typeof c.options.callback &&
                            c.options.callback
                                .apply(c.options.parent, [g])
                                .done(function () {
                                    e(b).removeClass("loading").prop("disabled", !1);
                                })
                                .fail(function () {
                                    e(b).removeClass("loading").prop("disabled", !1);
                                }));
            },
            slideDiv: function (a, b, c) {
                var d = this.$$.find("jq-tab").attr("value"),
                    f = d.split("-")[1],
                    g = this.details[f].length,
                    h = this.$$.find("jq-tab-pane[tab=" + d + "]"),
                    i = h.find(".js-movable-div"),
                    j = parseInt(i.css("left")),
                    k = i.width(),
                    l = 780;
                g > 3 && e(b).siblings(".js-arrow").show(), "left" == c.type ? (j < -l ? i.css("left", j + l) : (e(b).hide(), i.css("left", 0))) : k + j - l - 65 > l ? i.css("left", j - l) : (e(b).hide(), i.css("left", l + 65 - k));
            },
            getClassWithBookingClass: function (a, b) {
                var c = {},
                    d = [],
                    e = {};
                if (is.String(a)) d.push(a + (b ? " (" + b + ")" : "")), (e[a] = b ? [b] : []);
                else if (is.Array(a)) {
                    a.forEach(function (a, d) {
                        is.Array(a)
                            ? a.forEach(function (a, e) {
                                  is.Empty(a) || is.Empty(b[d][e]) || ((c[a] = c[a] || []), c[a].push(b[d][e]));
                              })
                            : is.Empty(a) || !is.String(a) || is.Empty(b[d]) || ((c[a] = c[a] || []), c[a].push(b[d]));
                    });
                    for (var f in c) {
                        var g = _.uniq(c[f]).join();
                        d.push(f + (g ? " (" + g + ")" : "")), (e[f] = g ? _.uniq(c[f]) : []);
                    }
                }
                return e;
            },
            formatBookingClass: function (a) {
                var b = [];
                for (var c in a) {
                    var d = "";
                    if (((d += c), a[c].length > 0)) {
                        var e = [];
                        for (var g in a[c]) {
                            var h = f.displayFareClass(a[c][g], !1);
                            is.Empty(h) || e.push(h);
                        }
                        e.length > 0 && (d += " (" + e.join(",") + ")");
                    }
                    b.push(d);
                }
                return b.join(",");
            },
            getBrandedFares: function (a) {
                var b = this,
                    c = e.Deferred(),
                    f = a.fk.toString();
                return (
                    h.has(f)
                        ? (b.brandedService && /\d/.test(f) && b.brandedService.abort(), c.resolve(h.get(f)))
                        : (b.brandedService = d.getBrandedFares(a).done(function (a) {
                              if (a.success)
                                  try {
                                      h.set(f, a);
                                  } catch (a) {}
                              c.resolve(a);
                          })),
                    c.promise()
                );
            },
            _remove_: function () {},
        };
    }),
    define({
        name: "at.flights",
        extend: "spamjs.view.extended",
        modules: [
            "at.flights.filter",
            "at.flights.results",
            "at.flights.header",
            "model.flightsearch",
            "jQuery",
            "jqbus",
            "at.flightservice",
            "at.common.functions",
            "jqrouter",
            "spamjs.modal",
            "at.login",
            "at.trips.utils",
            "jsutils.cache",
            "at.offers.section",
        ],
    }).as(function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
        IMAGE_PATH = CONTEXT_PATH + "resources/assets/scss/skin/img/airline-master";
        var p = { dep: 900, arr: 900 };
        return {
            globalEvents: { "flights.search.query": "searchQuery" },
            events: {
                "click jq-tab-head": "resultsDetailTabChange",
                "click .css-taxfees-cont": "toggleAllTaxes",
                "click .js-multi-city-accordion": "multicityAccordion",
                "click .js-fare-rules-link": "openFareRuleLink",
                "click .js-multi-more-info": "openMoreInfo",
                "click .js-branded-fares": "openBrandedFaresPopup",
                "click .js-book-flight": "bookFlight",
                "click .js-save-to-trips": "saveToTrips",
                "click .js-print-email-single-flight": "openSingleFlightEmailPopup",
                "click .js-close-fare-rule-popup": "closeFareRulePopup",
                "click .js-watch-video": "watchVideo",
                "click .js-baggage-read-more": "baggageNoteReadMore",
                "click .js-baggage-close": "baggageClose",
                "modal.closed .view-id-js-branded-fare-popup": "abortBrandedFareConfirmation",
                "modal.closed .view-id-js-covid-guide-modal": "onClonseCovidModal",
                "click .js-covid-guide": "openCovidModal",
            },
            routerEvents: { "#/search": "renderFlightsTemplate", "#/home": "renderFlightsTemplate", "?corpCodeFlag=": "updateCorporateFare" },
            _init_: function () {
                var a,
                    b = this;
                (b._self = f.extend(!0, {}, this)),
                    (b.searchInstance = []),
                    (b.pipe = g.instance()),
                    b.pipe.bind(this),
                    (b.flightSearch = e.instance()),
                    (b.jqrouter = j.instance(this)),
                    (a = b.jqrouter.getQueryParams()),
                    "#/covidGuide" === location.hash ? b.jqrouter.go("/covid-guide") : (!is.Empty(a) && b.isSearched(a)) || l.isLoginView() ? b.renderFlightsTemplate() : b.jqrouter.go("/flights#/search"),
                    b.removeLocalStorageCache();
            },
            isSearched: function (a) {
                return !(is.Empty(a) || is.Empty(a.origin) || is.Empty(a.destination) || is.Empty(a.depart));
            },
            renderFlightsTemplate: function () {
                var a = this;
                a.view({ src: "at.flights.html" }).done(function () {
                    var e = a.$$.find(".js-scroll-icon");
                    f(".modal-backdrop.fade.in").remove(),
                        i.setDocumentTitle("Flights | Aertrip"),
                        setTimeout(function () {
                            i.showFooter();
                        }, 500),
                        a.$$.find(".js-flights-home").show(),
                        $(window).scroll(function () {
                            $(this).scrollTop() > 50 && e.is(":visible") ? e.hide() : $(this).scrollTop() <= 50 && !e.is(":visible") && e.show();
                        }),
                        (a.$header = a.add(".searchBarMain", d.instance())),
                        a.add(".js-offers", o.instance({ type: "flight" })),
                        (a.$filters = a.add(b.instance({ id: "flights_filter", checkNonStopFilterState: a.checkNonStopFilterState, calleeObj: a }))),
                        (a.$results = a.add(c.instance({ id: "flightsResults", results: a.searchInstance, flightsInstance: a })));
                });
            },
            renderFiltersAndResults: function (a, b, c) {
                var d = this;
                if ("S" == d.searchType || "I" == this.flightType) d.searchInstance[0].updateAllStopFilter(c.status), d.publishResults(0);
                else for (var e = 0; e < d.totalLegs; e++) d.searchInstance[e].updateAllStopFilter(c.status), d.publishResults(e);
            },
            checkNonStopFilterState: function () {
                var a = this,
                    b = -1;
                if ("S" == a.searchType || "I" == this.flightType) (b = a.searchInstance[0].checkNonStopFilterState()), (b = "single" !== b && b);
                else {
                    for (var c = 0, d = 0, e = 0; e < a.totalLegs; e++) "single" === a.searchInstance[e].checkNonStopFilterState() ? d++ : a.searchInstance[e].checkNonStopFilterState() && c++;
                    b = a.totalLegs == c + d;
                }
                -1 != b && (a.jqrouter.setQueryParam("nonStopFlag", b), a.$$.find("#js-non-stop-header-flag").prop("checked", b).trigger("change"));
            },
            searchQuery: function (a, b, c) {
                var d = this,
                    e = this.jqrouter.getQueryParam("index");
                (d.sameDayReturn = d.jqrouter.getQueryParam("depart") == d.jqrouter.getQueryParam("return")),
                    (d.partialSearchIndex = is.Empty(e) ? "" : 1 * e),
                    (d.partial = c.partial),
                    d.abortPreviousRequest(),
                    d.$results.bookingRequest && d.$results.bookingRequest.abort(),
                    (d.searchCriteria = c.searchCriteria),
                    (d.sectorName = c.sectorName),
                    (d.sectorDate = c.sectorDate),
                    d.partial && (d.searchCriteria.display_groups = d.partialSearchIndex + 1),
                    d.$$.find(".js-flights-home").hide().next().show();
                var f = d.$$.find("#flight-search-loader");
                f.css("width", "2%").show(),
                    f.animate({ width: "25%" }),
                    d.partial || (d.$$.find("#flight-search-loader-text").show(), d.resetTemplates()),
                    (d.sectorTitle = d.getSectorTitles(d.searchCriteria)),
                    d.setDocumentTitle(),
                    h
                        .getFlightsSearchID(d.searchCriteria)
                        .done(function (a) {
                            if (a.success) {
                                if (is.Empty(a.data.sid)) return d.loadModifySearchResultsPage(), !1;
                                d.$$.find("#js-modify-filter").hide(),
                                    d.partial ? ((d.searchInstance[d.searchInstance.length - 1] = []), (d.searchInstance[d.partialSearchIndex] = [])) : (d.searchInstance = []),
                                    d.setSearchType(a.data.trip_type),
                                    d.setFlightType(a.data),
                                    (d.showTimeline = !1),
                                    "S" == d.searchType && a.data.showTimeline && (d.showTimeline = !0),
                                    d.searchResults(a);
                            } else i.alert.show(i.getErrorMsg("flights", a.errors, "getFlightsSearchID"), "error");
                        })
                        .fail(function () {});
            },
            setDocumentTitle: function () {
                var a = "Flights | Aertrip",
                    b = this.sectorTitle;
                is.Empty(b) ||
                    ((a = "multi" == b[0].tripType ? b[0].origin + " ... " + b[b.length - 1].dest : 2 == b.length && "return" == b[0].tripType ? b[0].origin + " ⇌ " + b[0].dest : b[0].origin + " → " + b[0].dest), (a += " | Aertrip")),
                    i.setDocumentTitle(a);
            },
            getSearchInstance: function (a) {
                var b = this;
                return b.flightSearch.instance({ searchType: b.searchType, totalLegs: b.totalLegs, nonStopFlag: b.searchCriteria.nonStopFlag, flightNumber: b.jqrouter.getQueryParam("flight-number"), sortStatus: b.getInitialSortStatus(a) });
            },
            getInitialSortStatus: function (a) {
                var b = this.jqrouter.getQueryParam("sort"),
                    c = ["airline-sorting", "depart-sorting", "arrive-sorting", "duration-sorting", "humane-sorting", "price-sorting"];
                return (b = is.Empty(b) ? "" : b[a]), (b = is.Empty(b) ? ["", ""] : b.split("_")), (b = c.indexOf(b[0]) > -1 && ["asc", "desc"].indexOf(b[1]) > -1 ? b : ["humane-sorting", "asc"]);
            },
            abortPreviousRequest: function () {
                var a = this;
                if (void 0 === a.searchRequest || "" === a.searchRequest) (a.searchRequest = {}), (a.searchRequestTimeout = {});
                else if (a.partial) {
                    for (var b = 0; b < a.searchRequest[a.partialSearchIndex].length; b++) a.searchRequest[a.partialSearchIndex][b].abort();
                    for (var c = 0; c < a.searchRequestTimeout[a.partialSearchIndex].length; c++) clearTimeout(a.searchRequestTimeout[a.partialSearchIndex][c]);
                    if (((a.searchRequest[a.partialSearchIndex] = []), (a.searchRequestTimeout[a.partialSearchIndex] = []), "R" == a.searchType)) {
                        for (var d = 0; d < a.searchRequest[a.totalLegs].length; d++) a.searchRequest[a.totalLegs][d].abort();
                        for (var e = 0; d < a.searchRequestTimeout[a.totalLegs].length; e++) clearTimeout(a.searchRequestTimeout[a.totalLegs][e]);
                        (a.searchRequest[a.totalLegs] = []), (a.searchRequestTimeout[a.totalLegs] = []);
                    }
                } else {
                    for (var f in a.searchRequest) for (var g = 0; g < a.searchRequest[f].length; g++) a.searchRequest[f][g].abort();
                    for (var h in a.searchRequestTimeout) for (var i = 0; i < a.searchRequestTimeout[h].length; i++) clearTimeout(a.searchRequestTimeout[h][i]);
                    (a.searchRequest = {}), (a.searchRequestTimeout = {});
                }
            },
            searchResults: function (a) {
                var b = this;
                if ("S" == b.searchType) (b.totalLegs = 1), (b.searchInstance[0] = b.getSearchInstance(0)), b.setFilterAndResultVariables(), b.serviceCall(a.data.sid, 0, 1);
                else if ("I" == b.flightType) (b.totalLegs = b.searchCriteria.totalLegs), (b.searchInstance[0] = b.getSearchInstance(0)), b.setFilterAndResultVariables(), b.serviceCall(a.data.sid, 0, 1);
                else if ("R" == b.searchType)
                    (b.totalLegs = 2),
                        (b.searchInstance[2] = b.getSearchInstance()),
                        b.partial
                            ? ((b.searchInstance[b.partialSearchIndex] = b.getSearchInstance()), b.setFilterAndResultVariables(), b.serviceCall(a.data.sid, b.partialSearchIndex, b.partialSearchIndex + 1))
                            : ((b.searchInstance[0] = b.getSearchInstance(0)), (b.searchInstance[1] = b.getSearchInstance(1)), b.setFilterAndResultVariables(), b.serviceCall(a.data.sid, 0, 1), b.serviceCall(a.data.sid, 1, 2)),
                        b.serviceCall(a.data.sid, 2, 0);
                else if ("M" == b.searchType)
                    if (((b.totalLegs = b.searchCriteria.totalLegs), (b.searchInstance[b.totalLegs] = b.getSearchInstance()), b.partial))
                        (b.searchInstance[b.partialSearchIndex] = b.getSearchInstance()), b.setFilterAndResultVariables(), b.serviceCall(a.data.sid, b.partialSearchIndex, b.partialSearchIndex + 1);
                    else {
                        for (var c = 0; c < b.totalLegs; c++) b.searchInstance[c] = b.getSearchInstance(c);
                        b.setFilterAndResultVariables();
                        for (var d = 0; d < b.totalLegs; d++) b.serviceCall(a.data.sid, d, d + 1);
                    }
            },
            resetTemplates: function () {
                this.$$.find("#flights_filter view, #flightsResults view, #js-modify-filter").html(""), this.$$.find("#js-multicity-header").html("").hide();
            },
            setSearchType: function (a) {
                var b = this;
                "single" == a ? (b.searchType = "S") : "return" == a ? (b.searchType = "R") : "multi" == a && (b.searchType = "M");
            },
            setFlightType: function (a) {
                var b = this;
                a.international && "single" != a.trip_type ? (b.flightType = "I") : (b.flightType = "D");
            },
            setFilterAndResultVariables: function () {
                var a = this;
                a.$results.setSearchVariables(a.searchInstance, a.searchType, a.totalLegs, a.flightType, a.partial),
                    a.$filters.setSearchVariables(a.searchInstance, a.searchType, a.totalLegs, a.flightType, a.partial, a.showTimeline),
                    a.$results.setSector(a.sectorName, a.sectorDate, a.sectorTitle);
            },
            serviceCall: function (a, b, c) {
                var d = this,
                    e = { sid: a, display_group_id: c },
                    f = h
                        .getFlightsSearchData(e)
                        .done(function (e) {
                            if (
                                (d.animateSearchLoader(e.data.completed, e.data.flights, b),
                                (d.$results.sid = a),
                                d.$$.find("#js-multicity-header").is(":visible") || "M" != d.searchType || "D" != d.flightType || d.loadMulticityHeader(),
                                e.success && !is.Empty(e.data.flights))
                            ) {
                                for (var f in e.data.flights) {
                                    var g = e.data.flights[f];
                                    g.results && (d.mergeResults(g, b, c), d.updateFilters(), 0 !== c && d.pipe.publish("flights.search.change", { searchIndex: b }), d.publishResults(b, c));
                                }
                                (d.searchRequestTimeout[b] = d.searchRequestTimeout[b] || []), e.data.done || d.delayedServiceCall(a, b, c);
                            } else if (100 == e.data.completed && is.Empty(d.searchInstance[b].origResults)) {
                                var h = !0;
                                for (var i in d.searchInstance)
                                    if (!is.Empty(d.searchInstance[i].origResults)) {
                                        h = !1;
                                        break;
                                    }
                                h && d.loadModifySearchResultsPage();
                            } else (d.searchRequestTimeout[b] = d.searchRequestTimeout[b] || []), e.data.done || d.delayedServiceCall(a, b, c);
                        })
                        .fail(function () {});
                return is.Empty(this.searchRequest[b]) && (this.searchRequest[b] = []), this.searchRequest[b].push(f), f;
            },
            delayedServiceCall: function (a, b, c) {
                var d = this;
                d.searchRequestTimeout[b].push(
                    setTimeout(function () {
                        d.serviceCall(a, b, c);
                    }, 2e3)
                );
            },
            publishResults: function (a, b) {
                var c = this;
                !1 !== (a = 0 === b ? c.$filters.searchIndex : a) && c.pipe.publish("flights.filter.change", { searchIndex: a, from: "search", filterInstance: c.$filters, sectorName: c.sectorName, sectorDate: c.sectorDate });
            },
            mergeResults: function (a, b, c) {
                var d = this;
                "I" == d.flightType && "S" != d.searchType
                    ? d.searchInstance[0].mergeInternationalResult(a, d.jqrouter.getQueryParam("PF"))
                    : 0 != c
                    ? d.searchInstance[b].mergeResult(a, d.jqrouter.getQueryParam("PF"))
                    : d.searchInstance[d.totalLegs].setComboResults(a);
            },
            loadModifySearchResultsPage: function () {
                var a = this;
                a.$$.find("#flight-search-loader-text").hide(),
                    a.$$.find(".js-flights-search").removeClass("loading"),
                    a.$$.find("#flight-search-loader").hide("slow"),
                    a.$$.find("#js-modify-filter").show(),
                    a.$$.find("#js-multicity-header").hide(),
                    a.load({ src: "at.flights.modify.search.html", selector: "#js-modify-filter", data: { searchType: a.searchType } });
            },
            loadMulticityHeader: function () {
                var a = this;
                a.$$.find("#js-multicity-header").show(),
                    a.$$.find("#flight-search-loader-text").hide(),
                    a.view({
                        src: "multi/at.flights.multi.header.html",
                        selector: "#js-multicity-header",
                        data: { rescheduling: 0, totalLegs: a.totalLegs, details: { origin: a.searchCriteria.origin, destination: a.searchCriteria.destination } },
                    });
            },
            animateSearchLoader: function (a, b, c) {
                var d = this,
                    e = d.$$.find("#flight-search-loader"),
                    g = (e.width() / f(window).width()) * 100;
                is.Empty(b) || d.$$.find("#flight-search-loader-text").hide(),
                    d.$$.find(".js-flights-search").removeClass("loading"),
                    a > g && f(e).css("width", a + "%"),
                    100 == a &&
                        (f(e).fadeOut(1e3),
                        d.searchInstance[c].setSearchCompletionStatus(a),
                        d.sameDayReturn && "D" == d.flightType && i.alert.show("We have pre-applied departure & arrival time filters to help you book faster.", "success"));
            },
            updateFilters: function () {
                var a = this,
                    b = a.jqrouter.getQueryParam("filters");
                a.jqrouter.getQueryParam("depart") == a.jqrouter.getQueryParam("return") &&
                    "D" == this.flightType &&
                    ((b = b || [{}, {}]),
                    is.Empty(b[0].dep_dt) ? (b[0].dep_dt = ["", p.dep]) : is.Empty(b[0].dep_dt[1]) && (b[0].dep_dt[1] = p.dep),
                    is.Empty(b[1].dep_dt) ? (b[1].dep_dt = [p.arr, ""]) : is.Empty(b[1].dep_dt[0]) && (b[1].dep_dt[0] = p.arr),
                    a.jqrouter.setQueryParam("filters", b));
                for (var c in b) if (!is.Empty(b[c]) && is.Object(b[c])) for (var d in b[c]) "I" == a.flightType ? a.searchInstance[0].updateFilter(d, b[c][d], c) : a.searchInstance[c].updateFilter(d, b[c][d]);
                a.checkNonStopFilterState();
            },
            openMoreInfo: function (a, b) {
                var c,
                    d = this,
                    e = "",
                    g = d.$results.getAllAirportDetails(),
                    b = b || d.$$.find(".js-multi-more-info"),
                    h = f(b).find("#js-multi-more-info-content"),
                    i = JSON.parse(JSON.stringify(d.$results.selectedFlights));
                if (-1 == i.indexOf(0)) {
                    if ((d.$results.setManuallySelectedStatus("all"), h.text().trim() && void 0 !== a)) return preventPropagation(a);
                    void 0 === a && (e = h.find("jq-tab").attr("value")),
                        (c = d.$results.getCombinedFareBreakup()),
                        c.isCombo &&
                            i.map(function (a) {
                                var b = c.refundPolicy;
                                (a.fare.cancellation_charges = b.cp), (a.fare.rescheduling_charges = b.rscp), (a.leg[0].rfd = b.rfd), (a.leg[0].rsc = b.rsc);
                            }),
                        d
                            .view({
                                src: "at.flights.multi.more.info.popup.html",
                                data: { defaultTab: e, selected: i, fare: { taxes: d.$results.results[0].taxes, fareDetails: c }, taxes: d.$results.results[0].taxes, apDet: g, alDet: d.$results.getAllAirlineDetails() },
                                selector: "#js-multi-more-info-content",
                            })
                            .done(function () {
                                d.moreOptionsBinding(), (e || "").indexOf("amenities") > -1 && d.resultsDetailTabChange(null, h.find("jq-tab-head[value=" + e + "]"));
                            });
                } else f(b).find("jq-popover-title").popover("hide");
            },
            moreOptionsBinding: function () {
                var a = this;
                for (var b in a.$results.selectedFlights)
                    for (var c = a.$results.selectedFlights[b], d = c.leg[0].flights.length - 1; d >= 0; d--) {
                        var e = { origin: c.leg[0].flights[d].fr, destination: c.leg[0].flights[d].to, airline: c.leg[0].flights[d].al, flight_number: c.leg[0].flights[d].fn };
                        a.loadDelayIndexTemplate(e, c.leg[0].flights[d].ffk);
                    }
                a.$$.find(".css-otherfees-cont").hide(), a.applyTooltip();
            },
            applyTooltip: debounce(function () {
                var a = this;
                a.$$.find(".flights--tooltip").tooltip({ placement: "bottom" }),
                    a.$$.find(".css-ellipsis").each(function () {
                        i.addTooltipForEllipsis(this);
                    });
            }, 100),
            loadDelayIndexTemplate: function (a, b) {
                var c = this;
                h.getDelayIndex(a).done(function (a) {
                    c.$$.find(".js-ffk-" + b).removeClass("loading"), c.load({ selector: ".js-ffk-" + b, src: "at.flights.delay.index.bar.html", data: a.data.delay_index || {} });
                });
            },
            openBrandedFaresPopup: function (a, b) {
                if (!f(b).prev().prop("disabled")) {
                    var c = this,
                        d = f(b).prev().attr("data-fk"),
                        e = f(b).prev().attr("data-fare"),
                        g = [];
                    "S" == c.searchType
                        ? (g[0] = c.$results.results[0].getResultsHavingFkey(d))
                        : "D" == c.flightType
                        ? ((g = c.$results.selectedFlights), (d = _.pluck(c.$results.selectedFlights, "fk")), (e = _.pluck(c.$results.selectedFlights, "farepr")))
                        : "S" != c.searchType && "I" == c.flightType && (g = c.$results.results[0].getIntlLegObjForFK(d)),
                        c.add(
                            k.instance({
                                id: "js-branded-fare-popup",
                                module: "at.flights.branded.fare",
                                moduleOptions: {
                                    data: {
                                        target: f(b).prev(".js-book-flight"),
                                        apData: c.$results.getAllAirportDetails(),
                                        alData: c.$results.getAllAirlineDetails(),
                                        selected: g,
                                        sid: c.$results.sid,
                                        fk: is.Array(d) ? d : [d],
                                        oldFare: is.Array(d) ? e : [e],
                                        isIntlReturn: "S" != c.searchType && "I" == c.flightType,
                                    },
                                    $results: c.$results,
                                    callback: c.closeBrandedFare,
                                    parent: c,
                                },
                            })
                        );
                }
            },
            closeBrandedFare: function (a) {
                var b = this,
                    c = f.Deferred();
                return is.Empty(a)
                    ? (b.remove("js-branded-fare-popup"), c.resolve(), c.promise())
                    : ((b.bookConfirmationSearch = b.$results.getBookingConfirmation(a).done(function () {
                          b.remove("js-branded-fare-popup");
                      })),
                      b.bookConfirmationSearch);
            },
            abortBrandedFareConfirmation: function () {
                this.bookConfirmationSearch && this.bookConfirmationSearch.abort();
            },
            resultsDetailTabChange: function (a, b, c) {
                var d = f(b).closest("jq-tab");
                d.find(".css-buggage-info, css-fl-baggage-row");
                f(b).attr("value").indexOf("amenities") > -1 && 0 === d.find(".css-flight-amenities-cont, css-fl-amenities-row").length && this.showFlightAmenitiesBaggage(d, c, "amenities"),
                    f(b).attr("value").indexOf("baggage") > -1 && this.showFlightAmenitiesBaggage(d, c, "baggage"),
                    f(b).attr("value").indexOf("refund") > -1 && !f(b).hasClass("fetched") && (bootloader.config().debug || f(b).addClass("fetched"), this.showRefundPolicy(d, c, b)),
                    f(b).attr("value").indexOf("fare-info") > -1 ? d.find(".js-multi-city-details").hide() : d.find(".js-multi-city-details").show();
            },
            showFlightAmenitiesBaggage: function (a, b, c) {
                var d = this,
                    e = d.getSelectedFlightsAndSID(b),
                    f = a.find("[class ^=js-fl-" + c + "-] .js-small-loader");
                f.show(),
                    ("amenities" == c ? h.getFlightsAmenities : h.getFlightsBaggage)(e).done(function (b) {
                        if ((f.hide(), b.success)) {
                            var e,
                                g = !1;
                            e = "S" == d.$results.searchType || "D" != d.$results.flightType || d.$results.isCombo ? i.getBaggageNotes(b.data, "results") : i.getBaggageNotes(b.data, "results", d.$results.selectedFlights);
                            for (var h in b.data) d.loadAmenitiesBaggageTemplate(h, b.data[h], c, e), !g && d.$results.checkPieceInBaggage(b.data[h]) && "baggage" == c && (g = !0);
                            is.Empty(b.data) && a.find('[class^="js-fl-' + c + '-"]').html('<div class="css-fl-' + c + '-row"><span class="css-not-info">Information not available</span></div>'),
                                g && d.$$.find(".js-baggage-piece-note").show();
                        } else a.find('[class^="js-fl-' + c + '-"]').html('<div class="css-fl-' + c + '-row"><span class="css-not-info">Information not available</span></div>');
                    });
            },
            showRefundPolicy: function (a, b, c) {
                var d = this,
                    e = { sid: d.$results.sid, fk: b.fk ? [b.fk] : [], fcp: 1 == b.fcp };
                "S" != d.searchType &&
                    "D" == d.flightType &&
                    (d.$results.selectedFlights.map(function (a) {
                        a.leg[0].fcp && e.fk.push(a.fk);
                    }),
                    is.Empty(e.fk) || ((e.fcp = !0), d.$results.isCombo && (e.fk = [e.fk.join("~")]))),
                    e.fcp && d.renderRefundPolicy(a, e, c);
            },
            getRefundPolicySelector: function (a) {
                return "D" == this.flightType && this.$results.isCombo
                    ? a
                          .split("~")
                          .map(function (a) {
                              return ".js-fl-refund-" + a;
                          })
                          .join(",")
                    : ".js-fl-refund-" + a.replace(/~/g, "-");
            },
            renderRefundPolicy: function (a, b, c) {
                var d = this;
                b.fk.map(function (b) {
                    a.find(d.getRefundPolicySelector(b)).html(i.getLoaderHTML("small"));
                }),
                    h
                        .getFlightsRefundPolicy(b)
                        .done(function (e) {
                            var g = 0;
                            e.success
                                ? _.map(e.data, function (b, c) {
                                      var e = ".js-fl-refund-" + c.replace(/~/g, "-");
                                      d.$results.updateRefundableStatus(c, g++, b.rfd),
                                          d
                                              .load({ src: "at.flights.refund.info.html", selector: e, data: { fk: c, rescheduling_charges: b.rscp, cancellation_charges: b.cp, isCombo: d.$results.isCombo, rfd: b.rfd, rsc: b.rsc } })
                                              .done(function () {
                                                  var c = a.closest(".js-tab-sepatator, .js-tab-sepatator-indicator").find(".js-rfd");
                                                  c.find("sup").remove(),
                                                      1 == b.rfd
                                                          ? c.find("i").removeClass("icon icon_non-refundable")
                                                          : 0 == b.rfd
                                                          ? c.find("i").addClass("icon icon_non-refundable").attr("title", "Non Refundable Flight").tooltip("fixTitle")
                                                          : -9 == b.rfd &&
                                                            c.find("i").addClass("icon icon_non-refundable").attr("title", "Refund Status Unkown").tooltip("fixTitle").parent().append('<sup class="css-unknown-refundable-sup-star">*</sup>'),
                                                      d.applyTooltip();
                                              });
                                  })
                                : (f(c).removeClass("fetched"),
                                  b.fk.map(function (b) {
                                      a.find(d.getRefundPolicySelector(b)).html("No Information Available");
                                  }));
                        })
                        .fail(function () {
                            f(c).removeClass("fetched"),
                                b.fk.map(function (b) {
                                    a.find(d.getRefundPolicySelector(b)).html("No Information Available");
                                });
                        });
            },
            getSelectedFlightsAndSID: function (a) {
                var b = this,
                    c = {},
                    d = "";
                "S" != b.$results.searchType && "D" == b.$results.flightType
                    ? ((d = _.pluck(b.$results.selectedFlights, "fk")), b.$results.isCombo && (d = [d.join("~")]))
                    : (d = 1 == b.$results.rescheduling && b.$results.totalLegs > 1 ? _.pluck(b.$results.selectedFlights, "fk") : [a.fk]),
                    (c.sid = b.$results.sid);
                for (var e = 0; e < d.length; e++) c["fk[" + e + "]"] = d[e];
                return c;
            },
            loadAmenitiesBaggageTemplate: function (a, b, c, d) {
                var e = !1;
                if ("baggage" === c && "D" === this.flightType) {
                    var e = !1,
                        f = this.$results.results;
                    for (var g in f) {
                        for (var h in f[g].origResults) {
                            for (var i in f[g].origResults[h].leg) {
                                for (var j in f[g].origResults[h].leg[i].flights) {
                                    var k = f[g].origResults[h].leg[i].flights[j];
                                    if (k.ffk === a && ["6E", "SG", "G8", "I5"].indexOf(k.al) > -1) {
                                        e = !0;
                                        break;
                                    }
                                }
                                if (e) break;
                            }
                            if (e) break;
                        }
                        if (e) break;
                    }
                    b = { bg: b.bg, cbg: b.cbg, covidNote: e };
                }
                this.load({ src: "at.flights." + c + ".html", selector: ".js-fl-" + c + "-" + a, data: b }),
                    "baggage" === c && d.hasOwnProperty(a) && this.load({ src: "at.flights.baggage.notes.html", selector: ".js-baggage-note-" + a, data: d[a] });
            },
            openFareRuleLink: function (a, b, c) {
                var d = this,
                    e = {};
                (e = d.$results.isCombo ? d.getSelectedFlightsAndSID(c) : { sid: d.$results.sid, fk: [c.fk] }),
                    f(b).hide().next().show(),
                    h
                        .getFareRules(e)
                        .done(function (a) {
                            a.success
                                ? (f(b).closest("jq-popover").find("jq-popover-title").popover("hide"),
                                  d.add(k.instance({ id: "fareInfoModal", src: "flights/at.flights.fare.rules.template.html", data: a.data })).done(function () {
                                      d.perfectScrollbar(d.$$.find(".c-scroll")).init();
                                  }))
                                : i.alert.show("Couldn't fetch fare rules for this journey", "error"),
                                f(b).show().next().hide();
                        })
                        .fail(function () {
                            f(b).show().next().hide(), i.alert.show("Couldn't fetch fare rules for this journey", "error");
                        });
            },
            bookFlight: function (a, b, c) {
                this.$$.find(".js-multi-more-info jq-popover-title").popover("hide"), this.$results.bookFlight(a, b, c);
            },
            openSingleFlightEmailPopup: function (a, b, c) {
                return this.$results.openSingleFlightEmailPopup(a, b, c), preventPropagation(a);
            },
            saveToTrips: function (a, b, c) {
                var d = this;
                if ((f(b).closest("jq-popover").find("jq-popover-title").popover("hide"), l.isLoggedIn())) {
                    var e = {},
                        g = this.jqrouter.getQueryParam("adult"),
                        h = this.jqrouter.getQueryParam("infant"),
                        j = this.jqrouter.getQueryParam("child");
                    paxCount = 1 * g + 1 * h + 1 * j;
                    var n = this.$results.getFlightDetailsForTrips(c);
                    (e.eventDetails = n.eventsData),
                        (e.total_cost = n.total_cost),
                        (e.passenger = is.Empty(paxCount) ? [] : new Array(paxCount)),
                        m.saveToTrips({ view: d._self, event_name: "flights", params: e }).done(function (a, b) {
                            a && (_.size(b.data) > 0 ? i.alert.show("Flight has been saved to trip successfully.", "success") : i.alert.show("Flight has already been saved to trip.", "success"));
                        });
                } else
                    k.confirm(this, { title: "Please sign in to save selected flight to trips", buttonLabel: "Sign In" }).done(function (a) {
                        a && d.jqrouter.go("#/login");
                    });
            },
            toggleAllTaxes: function (a, b) {
                f(b).nextUntil(".css-basefare-cont, .css-taxfees-cont, .css-faretotal-cont").slideToggle(300), this.applyTooltip();
            },
            closeFareRulePopup: function () {
                this.remove("fareInfoModal");
            },
            multicityAccordion: function (a, b) {
                var c = f(b).parent().siblings().find(".js-multi-city-accordion");
                f(b).next().slideDown(),
                    f(b).find("i:first").addClass("icon_down-small-arrow").removeClass("icon_right-down-small-arrow"),
                    c.next().slideUp(),
                    c.find("i:first").addClass("icon_right-down-small-arrow").removeClass("icon_down-small-arrow");
            },
            removeLocalStorageCache: function () {
                for (var a = [], b = 0; b < localStorage.length; b++) {
                    var c = localStorage.key(b);
                    (c.indexOf("airports") > -1 || c.indexOf("brandedFare") > -1) && a.push(c);
                }
                for (var b = 0; b < a.length; b++) localStorage.removeItem(a[b]);
            },
            getSectorTitles: function (a) {
                var b,
                    c,
                    d,
                    e = this,
                    g = [];
                return (
                    "multi" == a.trip_type
                        ? e.$$.find(".multiple-left-margin").each(function () {
                              (b = f(this).find(".multi-flights-origin:input").val()),
                                  (c = f(this).find(".multi-flights-destination:input").val()),
                                  (d = f(this).find(".multi-flights-depart-date").val()),
                                  b && g.push(e.getSectorTitleDetails(b, c, d));
                          })
                        : "return" == a.trip_type
                        ? ((b = e.$$.find(".single-flights-origin:input").val()),
                          (c = e.$$.find(".single-flights-destination:input").val()),
                          (g[0] = e.getSectorTitleDetails(b, c, a.depart)),
                          (g[1] = e.getSectorTitleDetails(c, b, a.return)))
                        : ((b = e.$$.find(".single-flights-origin:input").val()), (c = e.$$.find(".single-flights-destination:input").val()), (g[0] = e.getSectorTitleDetails(b, c, a.depart))),
                    g.map(function (b) {
                        return (b.tripType = a.trip_type), b;
                    })
                );
            },
            getSectorTitleDetails: function (a, b, c) {
                return (
                    (a = a.match(/([\w\s,]*)\(?(\w*)/)),
                    (b = b.match(/([\w\s,]*)\(?(\w*)/)),
                    (a = is.Empty(a) && a.indexOf(",") > -1 ? "" : a),
                    (b = is.Empty(b) && b.indexOf(",") > -1 ? "" : b),
                    { origin: is.Empty(a) ? "" : a[1], oiata: is.Empty(a) ? "" : is.Empty(a[2]) ? a[1] : a[2], dest: is.Empty(b) ? "" : b[1], diata: is.Empty(a) ? "" : is.Empty(b[2]) ? b[1] : b[2], date: c || "" }
                );
            },
            watchVideo: function (a, b, c) {
                i.showFullScreenVideo(this.$$, c.src);
            },
            baggageNoteReadMore: function (a, b) {
                f(b).text().indexOf("more") > -1 ? f(b).text("Show less").closest(".css-buggage-all-info-text").addClass("css-text-expand") : f(b).text("Show more").closest(".css-buggage-all-info-text").removeClass("css-text-expand"),
                    f(b).closest("jq-popover").find("jq-popover-title").popover("show");
            },
            baggageClose: function (a, b) {
                f(b).closest("jq-popover").find("jq-popover-title").popover("hide");
            },
            updateCorporateFare: function (a, b) {
                this.$filters.updateCorporateFare(b);
            },
            openCovidModal: function (a) {
                return this.add(k.instance({ id: "js-covid-guide-modal", src: "../common/at.common.covid.guidelines.html", data: {} })), this.jqrouter.go("#/covidGuide"), preventPropagation(a);
            },
            onClonseCovidModal: function () {
                this.jqrouter.go("#/search");
            },
            _remove_: function () {
                this.pipe.off(), this.jqrouter.off(), $("body").unmousewheel(), this.removeLocalStorageCache();
            },
        };
    }),
    _define_({ name: "at.flights.refund.info", extend: "spamjs.view.extended", modules: ["jQuery", "at.common.functions"] }).as(function (a, b, c) {
        return {
            events: { "click .js-continue-to-book": "continueToBook", "click .js-change-flight": "changeFlight" },
            _init_: function () {},
            formatRefundPolicy: function (a, b, c, d, e, f) {
                (this.source = "dashboard" == e), (this.code = f);
                var g = (a.details || a).SPCFEE,
                    h = (b.details || b).SPRFEE,
                    i = (a.details || a).RAF,
                    j = [],
                    k = [],
                    l = [];
                if (d) {
                    var m = { ADT: h.ADT[0].value };
                    h.CHD && (m.CHD = h.CHD[0].value),
                        h.INF && (m.INF = h.INF[0].value),
                        k.push({ hr: h.ADT[0].from_hour, value: m }),
                        h.ADT.map(function (a, b) {
                            var c = { ADT: a.value };
                            if (h.CHD) {
                                var d = Math.min(h.CHD.length - 1, b);
                                c.CHD = h.CHD[d].value;
                            }
                            if (h.INF) {
                                var d = Math.min(h.INF.length - 1, b);
                                c.INF = h.INF[d].value;
                            }
                            k.push({ hr: a.to_hour, value: c });
                        }),
                        (m = { ADT: g.ADT[0].value + (is.Empty(i) || is.Empty(i.ADT) || -1 === g.ADT[0].value || -9 === g.ADT[0].value ? 0 : i.ADT) }),
                        g.CHD && (m.CHD = g.CHD[0].value + (is.Empty(i) || is.Empty(i.CHD) || -1 === g.CHD[0].value || -9 === g.CHD[0].value ? 0 : i.CHD)),
                        g.INF && (m.INF = g.INF[0].value + (is.Empty(i) || is.Empty(i.INF) || -1 === g.INF[0].value || -9 === g.INF[0].value ? 0 : i.INF)),
                        j.push({ hr: g.ADT[0].from_hour, value: m }),
                        g.ADT.map(function (a, b) {
                            var c = { ADT: a.value + (is.Empty(i) || is.Empty(i.ADT) || -1 === a.value || -9 === a.value ? 0 : i.ADT) };
                            if (g.CHD) {
                                var d = Math.min(g.CHD.length - 1, b);
                                c.CHD = g.CHD[d].value + (is.Empty(i) || is.Empty(i.CHD) || -1 === g.CHD[d].value || -9 === g.CHD[d].value ? 0 : i.CHD);
                            }
                            if (g.INF) {
                                var d = Math.min(g.INF.length - 1, b);
                                c.INF = g.INF[d].value + (is.Empty(i) || is.Empty(i.INF) || -1 === g.INF[d].value || -9 === g.INF[d].value ? 0 : i.INF);
                            }
                            j.push({ hr: a.to_hour, value: c });
                        });
                } else
                    g.ADT[c].map(function (a, b) {
                        var d = { ADT: a.value + (is.Empty(i) || is.Empty(i.ADT) || -1 === a.value || -9 === a.value ? 0 : i.ADT[c]) };
                        if (g.CHD) {
                            var e = Math.min(g.CHD[c].length - 1, b);
                            d.CHD = g.CHD[c][e].value + (is.Empty(i) || is.Empty(i.CHD) || -1 === g.CHD[c][e].value || -9 === g.CHD[c][e].value ? 0 : i.CHD[c]);
                        }
                        if (g.INF) {
                            var e = Math.min(g.INF[c].length - 1, b);
                            d.INF = g.INF[c][e].value + (is.Empty(i) || is.Empty(i.INF) || -1 === g.INF[c][e].value || -9 === g.INF[c][e].value ? 0 : i.INF[c]);
                        }
                        j.push({ hr: a.slab + parseInt(a.sla / 3600), value: d });
                    }),
                        h.ADT[c].map(function (a, b) {
                            var d = { ADT: a.value };
                            if (h.CHD) {
                                var e = Math.min(h.CHD[c].length - 1, b);
                                d.CHD = h.CHD[c][e].value;
                            }
                            if (h.INF) {
                                var e = Math.min(h.INF[c].length - 1, b);
                                d.INF = h.INF[c][e].value;
                            }
                            k.push({ hr: a.slab + parseInt(a.sla / 3600), value: d });
                        });
                j.reverse(), k.reverse();
                for (var n = 1, o = 1, p = 0, q = 0; n || o; ) {
                    var r = {};
                    (r.hr = d ? Math.max(j[p].hr, k[q].hr) : Math.min(j[p].hr, k[q].hr)),
                        j[p].hr === r.hr ? ((r.can = j[p].value), p++) : (r.can = j[p - 1].value),
                        r.hr === k[q].hr ? ((r.rsc = k[q].value), q++) : (r.rsc = k[q - 1].value),
                        (r.hr = Math.max(r.hr, 0) + (1 == r.hr ? " hour" : " hours")),
                        l.push(r),
                        p === j.length && (j.push({ hr: d ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER }), (n = 0)),
                        q === k.length && (k.push({ hr: d ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER }), (o = 0));
                }
                return l.reverse(), l;
            },
            checkAerFee: function (a, b, c) {
                var d = Object.keys(a.ADT)[0],
                    e = !0;
                return (
                    c
                        ? ((e = e && 0 == a.ADT && 0 == b.ADT), a.hasOwnProperty("CHD") && (e = e && 0 == a.CHD && 0 == b.CHD), a.hasOwnProperty("INF") && (e = e && 0 == a.INF && 0 == b.INF))
                        : ((e = e && 0 == a.ADT[d][0].value && 0 == b.ADT[d][0].value),
                          a.hasOwnProperty("CHD") && (e = e && 0 == a.CHD[d][0].value && 0 == b.CHD[d][0].value),
                          a.hasOwnProperty("INF") && (e = e && 0 == a.INF[d][0].value && 0 == b.INF[d][0].value)),
                    e
                );
            },
            formatCurr: function (a) {
                return this.source ? c.format.amount(a, this.code) : c.format.amount(a, "", "html", "", "", "", "cancellation_rate");
            },
            _remove_: function () {},
        };
    });
(function (foo, bundles) {
    foo.__bundled__ = foo.__bundled__ ? foo.__bundled__.concat(bundles) : bundles;
})(this, [
    "aertrip/flights",
]); /*./resources/models/model.flightsearch.js,./resources/services/at.tripservice.js,./resources/modules/trips/at.trips.common.js,./resources/modules/trips/at.trips.utils.js,./resources/services/at.socialservice.js,./resources/common/social/at.social.share.js,./resources/common/offers/at.offers.section.js,./resources/modules/flights/at.flights.results.js,./resources/modules/flights/at.flights.filter.js,./resources/modules/flights/at.flights.header.js,./resources/modules/flights/at.flights.booking.confirmation.js,./resources/modules/flights/at.flights.branded.fare.js,./resources/modules/flights/at.flights.js,./resources/modules/flights/at.flights.refund.info.js*/
