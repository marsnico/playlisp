;
; Filename: loop.scm
; Desc: test loop
; Author: Nicolas Xiao
; Date: March 18th 2020
;
(do
  (define x 10)
  (loop (> x 0)
    (print x)
    (setv x (- x 1))))
