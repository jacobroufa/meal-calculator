'use strict';

var Diner = function Diner( opts ) {
  var self = this;

  this.dishes = 0;
  this.taxRate = opts.taxRate || 0.0825; // 8.25% is the standard prepared meal tax in Illinois
  this.preTaxTotal = 0;
  this.total = 0;
  this.tip = 0;

  if ( opts.dishes && Array.isArray( opts.dishes )) {
    opts.dishes.forEach( function( dish ) {
      self.addDish( dish );
    });
  }
};

Diner.prototype.addDish = function addDish( cost ) {
  this.dishes += 1;
  this.preTaxTotal += cost;
  this.calculateTotal(); // every time we add a dish we want to recalculate the total
};

Diner.prototype.calculateTotal = function calculateTotal() {
  this.total = this.preTaxTotal + ( this.preTaxTotal * this.taxRate );
};

Diner.prototype.calculateTip = function calculateTip( tipRate ) {
  var rate = tipRate || 0.2; // let's be generous to our wait-staff

  this.tip = this.total * rate;
};

var Meal = function Meal( opts ) {
  this.diners = {}; // each diner will be a 'Name': DinerObject
  this.totalBill = 0;
  this.taxRate = opts && opts.taxRate || 0.0825;
};

Meal.prototype.addDiner = function addDiner( dinerName, dishes ) {
  var opts = {
    taxRate: this.taxRate // diners need to calculate tax separately to ensure "fair share"
  };

  if ( dishes && Array.isArray( dishes )) {
    opts.dishes = dishes; // we can add the dishes right to the diner, or calculate manually...
  }

  this.diners[dinerName] = new Diner( opts );
};

Meal.prototype.totalDinersBill = function totalDinersBill() {
  var diner;

  for ( diner in this.diners ) {
    this.totalBill += this.diners[diner].total;
  }
};

Meal.prototype.printTotalBill = function printTotalBill() {
  var diner, tmpDiner;

  this.totalDinersBill(); // calculate the total

  console.log( 'Your total bill is: $' + this.totalBill.toFixed( 2 )); // show the total
  console.log( '\n----------------------\n' );
  console.log( 'Breakdown by diner:\n' );

  for ( diner in this.diners ) {
    this.diners[diner].calculateTip();

    tmpDiner = this.diners[diner];

    console.log( diner + ' owes $' + tmpDiner.total.toFixed( 2 ) + ' and a tip of $' + tmpDiner.tip.toFixed( 2 ));
  }
};

var meal = new Meal();

meal.addDiner( 'Jacob', [8.5, 2.5, 2.5, 13]);
meal.addDiner( 'Caitlin', [7.25, 2.5, 17]);

meal.printTotalBill();
